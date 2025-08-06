/* 
 * This is an incredibly bodgy script that takes odoc's HTML-fragment JSON
 * output and munges it into a form that Vitepress will accept.
 */

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
const tagPattern = /<\/?.+?>/g;
/*
 * Transforms the content of a heading, where:
 * - <code> tags are converted to backticks for code formatting
 * - All other HTML tags are stripped out
 */
const transformHeaderContent = content =>
  content
    .replace(codeTagPattern, (_, c) => '`' + c + '`')
    .replace(tagPattern, '');

/*
 * Transforms a HTML header (e.g. <h1>...</h1>) into nice markdown.
 * - Odoc allows empty headings, so we use a zero-width space to maintain it in
 *   that case
 * - If the heading has an ID, it is maintained using the {#some-id} syntax
 */
const transformHeader = (old, level, content, id) => {
  const newContent = transformHeaderContent(content) || '&ZeroWidthSpace;';
  const pre = '#'.repeat(parseInt(level));
  const anchor = id ? ` {#${id}}` : '';
  return `\n\n${pre} ${newContent}${anchor}\n\n`;
};

const hIdPattern = /<h(\d).+?id="(.*?)".*?>(.*?)<\/h\1>/g;
const hPattern = /<h(\d)>(.*?)<\/h\1>/g;
/*
 * A wrapper for transformHeader() that handles the case where the heading does
 * or does not have an id property.
 */
const transformH = content =>
  content
    .replace(hIdPattern, (pre, n, id, c) => transformHeader(pre, n, c, id))
    .replace(hPattern, (pre, n, c) => transformHeader(pre, n, c));

const specialMdCharsPattern = /[\(\)*\[\\\]`_{}]/g;
/*
 * Escapes a whole bunch of things in "plain-text" content i.e. not part of an
 * HTML tag
 * - Various Markdown-related characters are coverted to the relevant HTML
 *   escape sequence; Vite fails otherwise
 * - Odoc intentionally uses whitespace (specifically, newlines and leading
 *   whitespace), but Vitepress clobbers it; to counter this, newlines get a
 *   <br/> and leading spaces are convert to &nbsp;
 */
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

const betweenTagsPattern = /(>)(.*?)(<)/gs;
const emptyLinePattern = /\n\s*\n/g;
/*
 * Delegates transformations for non-heading HTML
 */
const transformHtml = content => {
  content = content
    .replace(emptyLinePattern, "\n&ZeroWidthSpace;\n")
    .replace(
      betweenTagsPattern,
      (_, pre, inner, post) => pre + transformBetweenTags(inner) + post
    );
  return content;
};

const hEndPattern = /<\/h\d>$/;
/*
 * Transforms based on whether the "section" is a heading or not
 */
const transformSection = section =>
  section.match(hEndPattern) ?
    transformH(section) :
    transformHtml(section);

const hSepPattern = /\s*(?=<h\d)|(?<=<\/h\d>)\s*/g;
/*
 * Because of how we escape things, we need to treat headings differently from
 * everything else; here, we split headings from non-headings and transform
 * them accordingly.
 */
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
/*
 * Renders the breadcrumb information provided by odoc to HTML.
 * Currently we're only generating the "gillian" docs, so we skip the first
 * breadcrumb odoc makes for the top-level index.
 */
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
  const breadcrumbsHtml = makeBreadcrumbs(breadcrumbs);
  const targetContent = transformContent(breadcrumbsHtml + header + content);

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
