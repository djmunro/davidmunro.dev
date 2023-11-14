const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

// Variables
const ARTICLES_DIR = "articles";
const TEMPLATE_DIR = "template";

// Helper functions
const fp = (...relative) => path.join(__dirname, ...relative);
const write = (path, content) => {
  fs.writeFileSync(path, content);
  console.log(`wrote ${path.replace(`${__dirname}/`, "")}`);
};

const articles = fs.readdirSync(fp(ARTICLES_DIR)).sort((a, b) => a.localeCompare(b));
const articleTemplate = fs.readFileSync(fp(TEMPLATE_DIR, "article.html"), "utf-8");
const converter = new showdown.Converter({metadata: true});
const indexTemplate = fs.readFileSync(fp(TEMPLATE_DIR, "index.html"), "utf-8");
const outputDir = "dist";

// Setup output directory
try {
  fs.rmSync(fp(outputDir), { recursive: true });
} catch (e) {
  console.log("info: no existing dist directory");
}
fs.mkdirSync(fp(outputDir));
fs.mkdirSync(fp(outputDir, ARTICLES_DIR));

const articleLinks = []

articles
  .filter(file => file.endsWith('.md'))
  .forEach(file => {
    const content = fs.readFileSync(fp(ARTICLES_DIR, file), "utf-8")

    const {date, title} = converter.getMetadata();
    const articleContent = converter.makeHtml(content);
    const articleHtml = articleTemplate
      .replace(/{{ title }}/g, title)
      .replace(/{{ date }}/g, date)
      .replace('{{ content }}', articleContent);

    write(fp(outputDir, ARTICLES_DIR, `${title}.html`), articleHtml)

    // Generate article links for index page
    articleLinks.push(`<li><a href="/articles/${title}.html">${title}</a> - ${date}</li>`)
  })

write(fp(outputDir, "index.html"), indexTemplate.replace('{{ links }}', articleLinks.join('\n')))
write(fp(outputDir, 'styles.css'), fs.readFileSync(fp('template', 'styles.css')))