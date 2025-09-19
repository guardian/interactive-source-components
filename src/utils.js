import { buildSync } from "esbuild";
import { Script, createContext } from "vm";
import * as path from "path";
import * as fs from "fs";
import prettier from "prettier";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import postcssMergeSelectors from "postcss-combine-duplicated-selectors";

/**
 * @param {string} [startDir]
 */
export function findProjectRoot(startDir = getMetaUrlDir(import.meta.url)) {
  let dir = startDir;

  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "node_modules"))) {
      return dir;
    }

    dir = path.dirname(dir);
  }

  throw new Error('"node_modules" directory not found');
}

/**
 * @param {string} distRelativeSourcePath
 */
export function getFullPathFor(distRelativeSourcePath) {
  const root = findProjectRoot();

  const fullPath = path.join(
    root,
    "node_modules/@guardian/source/dist",
    distRelativeSourcePath,
  );

  return fullPath;
}

/**
 * @param {string} path
 */
export function loadSourceContext(path) {
  const code = buildSync({
    entryPoints: [path],
    bundle: true,
    platform: "node",
    write: false,
    outdir: "out",
  }).outputFiles[0].text;

  const context = createContext({
    console,
    module: { exports: {} },
    exports: {},
    process,
  });

  new Script(code).runInContext(context);

  Object.freeze(context);

  return context;
}

/**
 * @param {string} moduleDir
 */
export function getDistPath(moduleDir) {
  const root = findProjectRoot();
  let relPath = path.relative(root, moduleDir);

  relPath = relPath.replace(/^src(\/|\\)/, "dist$1");

  const leaf = path.basename(moduleDir);
  const cssFile = `${leaf}.css`;

  const parentDir = path.dirname(relPath);

  return path.join(parentDir, cssFile);
}

/**
 * @param {string} className
 * @param {string|Array|Object} styles
 */
export function classTuple(className, ...restStyles) {
  let joinedStyles = "";

  restStyles.forEach((styles) => {
    if (Array.isArray(styles)) {
      styles.forEach((item) => {
        if (typeof item === "string") {
          joinedStyles += item;
        } else if (typeof item?.styles === "string") {
          joinedStyles += item.styles;
        }
      });
    } else if (
      typeof styles === "object" &&
      typeof styles?.styles === "string"
    ) {
      joinedStyles = styles.styles;
    } else {
      joinedStyles = styles;
    }
  });

  return /** @type {[string, string]} */ ([
    className,
    `.${className} {${joinedStyles}}`,
  ]);
}

/**
 * @param {string} metaUrl
 */
export function getMetaUrlDir(metaUrl) {
  let dir = path.dirname(metaUrl);

  if (dir.startsWith("file://")) {
    // Remove "file://" scheme
    dir = dir.slice(7);
  }

  return dir;
}

export async function tidyCss(css) {
  css = css.replace(/\n;\n/g, "\n");

  const postcssResult = await postcss([
    postcssNested(),
    postcssMergeSelectors(),
  ]).process(css, { from: undefined });

  css = postcssResult.css;

  css = await prettier.format(css, { parser: "css" });

  return css;
}

/**
 * @param {string} camelCaseName
 */
export function camelToKebab(camelCaseName) {
  return camelCaseName.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );
}

/**
 * @param {Array<Array<string>>} classes
 * @param {string} distPath
 */
export async function writeLabelClasses(classes, distPath) {
  let css = "";

  classes.forEach(([_, classDecl]) => {
    css += classDecl + "\n\n";
  });

  css = await tidyCss(css);

  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, css);
}
