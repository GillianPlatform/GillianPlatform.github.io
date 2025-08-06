const fs = require("fs");
const path = require("path");

function traverseDirectory(baseSourceDir, ext, f, acc) {
  const pathAcc = acc || [];
  const sourceDir = path.join(baseSourceDir, ...pathAcc);
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      traverseDirectory(baseSourceDir, ext, f, [...pathAcc, file.name]);
    } else if (file.isFile() && file.name.endsWith(ext)) {
      f(file.name, pathAcc);
    }
  };
}

const codeTagPattern = /<code(?:\s.*?)?>(.*)<\/code>/g;
const tagPattern = /<\/?.+?>/g
const transformHeaderContent = content =>
  content
    .replace(codeTagPattern, (_, c) => '`' + c + '`')
    .replace(tagPattern, '');

const transformHeader = (old, level, content, id) => {
  const newContent = transformHeaderContent(content) || '&ZeroWidthSpace;';
  const pre = '#'.repeat(parseInt(level));
  const anchor = id ? ` {#${id}}` : '';
  return `\n\n${pre} ${newContent}${anchor}\n\n`;
}

const hIdPattern = /<h(\d).+?id="(.*?)".*?>(.*?)<\/h\1>/g;
const hPattern = /<h(\d)>(.*?)<\/h\1>/g;
const transformH = content =>
  content
    .replace(hIdPattern, (pre, n, id, c) => transformHeader(pre, n, c, id))
    .replace(hPattern, (pre, n, c) => transformHeader(pre, n, c));

const specialMdCharsPattern = /[\(\)*\[\\\]`_{}]/g;
const charSubst = {
  "(": "&#40;",
  ")": "&#41;",
  "*": "&#42;",
  "[": "&#91;",
  "\\": "&#92;",
  "]": "&#93;",
  "`": "&#96;",
  "_": "&#95;",
  "{": "&#123;",
  "}": "&#125;",
};
const newlinePattern = /\n([^\S\r\n]*)/g;
const transformBetweenTags = content =>
  content
    .replace(specialMdCharsPattern, c => charSubst[c])
    .replace(newlinePattern, (_, s) =>
      "\n<br>" + "&nbsp;".repeat(s.length));

const betweenTagsPattern = /(>)(.*?)(<)/gs
const emptyLinePattern = /\n\s*\n/g;
const transformHtml = content => {
  content = content
    .replace(emptyLinePattern, "\n&ZeroWidthSpace;\n")
    .replace(
      betweenTagsPattern,
      (_, pre, inner, post) => pre + transformBetweenTags(inner) + post
    );
  return content;
};

const hEndPattern = /<\/h\d>$/
const transformSection = section =>
  section.match(hEndPattern) ?
    transformH(section) :
    transformHtml(section)

const hSepPattern = /\s*(?=<h\d)|(?<=<\/h\d>)\s*/g
const transformContent = content =>
  content
    .split(hSepPattern)
    .map(transformSection)
    .join('\n');

const makeBreadcrumb = ({ name, href }) => {
  const inner = href === "#" ? `${name}` : `<a href="${href}">${name}</a>`;
  return `<code>${inner}</code>`;
};

const breadcrumbSep = " » ";
const makeBreadcrumbs = breadcrumbs => {
  breadcrumbs = breadcrumbs.slice(1);
  if (breadcrumbs.length <= 1)
    return "";
  const inner = breadcrumbs
    .map(makeBreadcrumb)
    .join(breadcrumbSep);
  return `<div class="odoc-breadcrumbs">${inner}</div>`;
};

function transformFile(sourceDir, baseTargetDir, ext, filename, pathParts) {
  const sourceFile = path.join(sourceDir, ...pathParts, filename);
  const sourceContent = fs.readFileSync(sourceFile);
  const { header, content, breadcrumbs } = JSON.parse(sourceContent);

  const targetDir = path.join(baseTargetDir, ...pathParts);
  fs.mkdirSync(targetDir, { recursive: true });

  const targetFile = filename.slice(0, -ext.length) + '.md';
  const targetPath = path.join(targetDir, targetFile);
  const breadcrumbs_ = makeBreadcrumbs(breadcrumbs)
  const targetContent = transformContent(makeBreadcrumbs(breadcrumbs) + header + content);

  fs.writeFileSync(targetPath, targetContent);
}

function transformAll(sourceDir, targetDir, ext) {
  const f = (filename, pathParts) =>
    transformFile(sourceDir, targetDir, ext, filename, pathParts);
  traverseDirectory(sourceDir, ext, f);
}

const [ , , sourceDir, targetDir ] = process.argv;
const ext = ".html.json";
transformAll(sourceDir, targetDir, ext);
