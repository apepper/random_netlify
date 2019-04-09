const { loremIpsum } = require("lorem-ipsum");
const fse = require("fs-extra");
const path = require("path");

const TARGET_DIR = "build";

function randomHtml() {
  return `<html>
<body>
${loremIpsum({ count: 5, format: "html" })}
</body>
</html>`;
}

function storeResult(filename, content) {
  const filePath = path.join(TARGET_DIR, filename);
  if (!path.normalize(filePath).startsWith(`${TARGET_DIR}`)) {
    console.log(`filename "${filename}" is invalid! Skipping file...`);
    return;
  }
  try {
    fse.outputFileSync(filePath, content, { flag: "wx" });
  } catch (e) {
    if (e.code === "EEXIST") {
      console.log(
        `Filename "${filename}" already exists in ${TARGET_DIR}! Skipping file...`
      );
    } else {
      throw e;
    }
  }
}

console.log(`Removing ${TARGET_DIR}/`);
fse.removeSync(TARGET_DIR);

console.log(`Creating ${TARGET_DIR}/`);
fse.mkdirpSync(TARGET_DIR);

const nrOfItems = 7500;

Array.from({ length: nrOfItems }).forEach((x, i) => {
  storeResult(`${i}.html`, randomHtml());
});

console.log(`Generated ${nrOfItems} random pages`);
