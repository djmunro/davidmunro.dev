const fs = require("fs");
const path = require("path");

// Directory path
const articlesDir = "./articles";

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

    // Add the data to the articleData array
    articleData.push({ title, date });
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

// Create article pages
articleData.forEach((article) => {
  // Read article template and update `{{ title }}` and `{{ date }}`
  fs.readFile("./template/article.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const html = data
      .replace("{{ title }}", article.title)
      .replace("{{ date }}", article.date);

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