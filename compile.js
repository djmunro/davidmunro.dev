const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

// Variables
const ARTICLES_DIR = "articles";
const TEMPLATE_DIR = "template";

// Helper functions
const fp = (...relative) => path.join(__dirname, ...relative);
const write = (path, content) => {
  fs.writeFileSync(path, content);
  console.log(`wrote ${path.replace(`${__dirname}/`, "")}`);
};

const articles = fs
  .readdirSync(fp(ARTICLES_DIR))
  .map((filename) => {
    const filePath = fp(ARTICLES_DIR, filename);
    return {
      name: filename,
      time: fs.statSync(filePath).mtime.getTime(),
    };
  })
  .sort((a, b) => b.time - a.time) // Sort in descending order of modification time
  .map((file) => file.name);
const articleTemplate = fs.readFileSync(
  fp(TEMPLATE_DIR, "article.html"),
  "utf-8"
);
const converter = new showdown.Converter({ metadata: true });
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

const articleLinks = [];

articles
  .filter((filename) => filename.endsWith(".md"))
  .forEach((filename) => {
    const content = fs.readFileSync(fp(ARTICLES_DIR, filename), "utf-8");

    const articleContent = converter.makeHtml(content);
    const { date, title } = converter.getMetadata();
    const articleHtml = articleTemplate
      .replace(/{{ title }}/g, title)
      .replace(/{{ date }}/g, date)
      .replace("{{ content }}", articleContent);

    const filenameWithoutExtension = filename.replace(/\.md$/, "");

    write(
      fp(outputDir, ARTICLES_DIR, `${filenameWithoutExtension}.html`),
      articleHtml
    );

    // Generate article links for index page
    articleLinks.push(
      `<li><a href="/articles/${filenameWithoutExtension}.html">${title}</a> - ${date}</li>`
    );
  });

write(
  fp(outputDir, "index.html"),
  indexTemplate.replace("{{ links }}", articleLinks.join("\n"))
);
write(
  fp(outputDir, "styles.css"),
  fs.readFileSync(fp("template", "styles.css"))
);
