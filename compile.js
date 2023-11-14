const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

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
const converter = new showdown.Converter();
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

// Write index and articles
const articleData = articles
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const [title, date] = file.split('.');
    const content = fs.readFileSync(fp(ARTICLES_DIR, file), "utf-8")
    return { title, date, content };
  });

const articleLinks = articleData.map(article => `<li><a href="/articles/${article.title}.html">${article.title}</a> - ${article.date}</li>`);
const indexHtml = indexTemplate.replace('{{ links }}', articleLinks.join('\n'));
write(fp(outputDir, "index.html"), indexHtml);

for (const article of articleData) {
  const articleContent = converter.makeHtml(article.content);
  const articleHtml = articleTemplate
      .replace(/{{ title }}/g, article.title)
      .replace(/{{ date }}/g, article.date)
      .replace('{{ content }}', articleContent);
  write(fp(outputDir, ARTICLES_DIR, `${article.title}.html`), articleHtml)
}

write(fp(outputDir, 'styles.css'), fs.readFileSync(fp('template', 'styles.css')))