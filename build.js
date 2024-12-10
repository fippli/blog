const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const handlebars = require("handlebars");
const matter = require("gray-matter");

// create docs if it doesn't exist
if (!fs.existsSync("docs")) {
  fs.mkdirSync("docs");
}

const postsDir = path.join(__dirname, "posts");
const docsDir = path.join(__dirname, "docs");

const converter = new showdown.Converter({
  ghCodeBlocks: true, // Enables fenced code blocks
  tables: true, // Enables GitHub-style tables
});

const postTemplateHtml = fs.readFileSync(
  path.join(__dirname, "post.template.html"),
  "utf8",
);

const template = handlebars.compile(postTemplateHtml);

let posts = [];

try {
  const files = fs.readdirSync(postsDir);

  files.forEach((file) => {
    if (path.extname(file) === ".md") {
      const filePath = path.join(postsDir, file);
      const fileName = `${path.basename(file, ".md")}.html`;

      const markdownContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(markdownContent);
      const article = converter.makeHtml(content);
      const html = template({ article, title: data.title });

      switch (data.status) {
        case "published": {
          posts.push({ ...data, fileName });
          fs.writeFileSync(path.join(docsDir, fileName), html);
          break;
        }
        case "draft": {
          // if the file exists, delete it
          if (fs.existsSync(path.join(docsDir, fileName))) {
            fs.unlinkSync(path.join(docsDir, fileName));
          }
          break;
        }

        case "unlisted": {
          fs.writeFileSync(path.join(docsDir, fileName), html);
          break;
        }

        default: {
          break;
        }
      }
    }
  });
} catch (err) {
  console.error({ err });
  return;
}

//
// Generate index.html
//

const postsHtml = posts
  .toSorted((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })
  .map((post) => {
    const description = converter.makeHtml(post.description);
    return `<li>
            <h3>
              <a href="${post.fileName}">${post.title}</a>
            </h3>
            ${description}
          </li>`;
  })
  .join("");

try {
  const indexTemplateHtml = fs.readFileSync(
    path.join(__dirname, "index.template.html"),
    "utf8",
  );

  const indexTemplate = handlebars.compile(indexTemplateHtml);
  const indexHtml = indexTemplate({ posts: postsHtml });

  fs.writeFileSync(path.join(docsDir, "index.html"), indexHtml);
} catch (err) {
  console.error(err);
  return;
}
