const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

const fp = (...relative) => path.join(__dirname, ...relative);

const outputDir = "dist";
const indexTemplate = fs.readFileSync(fp("template", "index.html"), "utf-8");
const articleTemplate = fs.readFileSync(fp("template", "article.html"), "utf-8");
const articles = fs.readdirSync(fp("articles")).sort((a, b) => a.localeCompare(b));

const write = (path, content) => {
  fs.writeFileSync(path, content);
  console.log(`wrote ${path.replace(`${__dirname}/`, "")}`);
};

const articleData = articles
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const [title, date] = file.split('.');
    const content = fs.readFileSync(fp("articles", file), "utf-8")
    return { title, date, content };
  });

const articleLinks = articleData.map(article => `<li><a href="/articles/${article.title}.html">${article.title}</a> - ${article.date}</li>`);

const indexHtml = indexTemplate.replace('{{ links }}', articleLinks.join('\n'));

try {
  fs.rmSync(fp(outputDir), { recursive: true });
} catch (e) {
  console.log("info: no existing dist directory");
}

fs.mkdirSync(fp(outputDir));

write(fp(outputDir, "index.html"), indexHtml);

fs.mkdirSync(fp(outputDir, "articles"));

const converter = new showdown.Converter();

for (const article of articleData) {
  const articleContent = converter.makeHtml(article.content);
  const articleHtml = articleTemplate
      .replace(/{{ title }}/g, article.title)
      .replace(/{{ date }}/g, article.date)
      .replace('{{ content }}', articleContent);
  write(fp(outputDir, "articles", `${article.title}.html`), articleHtml)
}

write(fp(outputDir, 'styles.css'), fs.readFileSync(fp('template', 'styles.css')))