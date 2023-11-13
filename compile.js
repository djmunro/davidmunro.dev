const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

// Constants
const articlesDir = "./articles";
const cssSourcePath = path.join(__dirname, 'template', 'styles.css');
const cssDestPath = path.join(__dirname, 'dist', 'styles.css');

// Read the content of the source file and write it to the destination
fs.copyFileSync(cssSourcePath, cssDestPath);


// Array to hold article data
let articleData = [];

// Read files from the directory
const files = fs.readdirSync(articlesDir);

files.forEach((file) => {
  // Split the filename to extract title and date
  const parts = file.split(".");
  if (parts.length === 3 && parts[2] === "md") {
    const title = parts[0];
    const date = parts[1];

    // Read the content of the file
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // Add the data to the articleData array
    articleData.push({ content, date, title });
  }
});

console.log(articleData);

// Create links from the article data
const links = articleData.map((article) => {
  return `<li><a href="/articles/${article.title}.html">${article.title}</a> - ${article.date}</li>`;
});

console.log(links);

// Create dist directory if it doesn't exist
if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

// Read index template and update `{{ links }}` with the links
fs.readFile("./template/index.html", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const html = data.replace("{{ links }}", links.join("\n"));
  fs.writeFile("./dist/index.html", html, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Successfully compiled index.html");
  });
});

// Setup markdown converter
const converter = new showdown.Converter();

// Create article pages
articleData.forEach((article) => {
  // Read article template and update `{{ title }}` and `{{ date }}`
  fs.readFile("./template/article.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const articleContent = converter.makeHtml(article.content);

    const html = data
      .replace(/{{ title }}/g, article.title)
      .replace(/{{ date }}/g, article.date)
      .replace("{{ content }}", articleContent);

    // Create the article directory if it doesn't exist
    if (!fs.existsSync("./dist/articles")) {
      fs.mkdirSync("./dist/articles");
    }

    // Write the compiled HTML to a file in the `dist` directory
    fs.writeFile(
      `./dist/articles/${article.title}.html`,
      html,
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log(`Successfully compiled ${article.title}.html`);
      }
    );
  });
});
