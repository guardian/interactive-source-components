import { renderToString } from "react-dom/server";
import {
  camelToKebab,
  findProjectRoot,
  getDistPath,
  getFullPathFor,
  getMetaUrlDir,
  loadSourceContext,
  tidyCss,
} from "../utils.js";
import { globSync } from "fs";
import * as path from "path";
import * as fs from "fs";
import { JSDOM } from "jsdom";

const document = new JSDOM("<!DOCTYPE html>").window.document;

(async () => {
  const iconClasses = [];

  const sizeContent = loadSourceContext(
    getFullPathFor("foundations/__generated__/size.js"),
  );

  for (let [name, pixels] of Object.entries(sizeContent.iconSize)) {
    iconClasses.push([
      `src-icon--${name}`,
      `.src-icon--${name} {` +
        `\twidth: ${pixels}px;\n` +
        `\theight: ${pixels}px;\n` +
        `}\n`,
    ]);
  }

  const iconsPath = path.join(
    findProjectRoot(),
    "node_modules/@guardian/source/dist/react-components/__generated__/icons/",
  );

  for (const fullPath of globSync(`${iconsPath}/*.js`)) {
    try {
      const iconName = path.parse(fullPath).name;
      const context = loadSourceContext(fullPath);

      if (!(iconName in context)) {
        throw new Error(
          `"${iconName}" not found in ${path.basename(fullPath)} context`,
        );
      }

      const renderedIcon = renderToString(
        context[iconName]({ size: "medium" }),
      );

      const template = document.createElement("template");
      template.innerHTML = renderedIcon;
      template.setAttribute("shadowrootmode", "open");

      const svg = /** @type {SVGElement} */ (
        template.content.firstElementChild
      );

      for (let attr of svg.getAttributeNames()) {
        if (!["viewBox", "xmlns"].includes(attr)) {
          svg.removeAttribute(attr);
        }
      }

      const encodedIcon = `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`;
      const kebabName = camelToKebab(iconName).replace("svg-", "");

      template.remove();
      svg.remove();

      const css =
        `.src-icon--${kebabName} {` +
        `\tdisplay: inline-block;\n` +
        `\twidth: ${context.iconSize.medium}px;\n` +
        `\theight: ${context.iconSize.medium}px;\n` +
        `\tmask-image: url("${encodedIcon}");\n` +
        `\tmask-repeat: no-repeat;\n` +
        `\tmask-size: contain;\n` +
        `\tbackground-color: currentcolor;\n` +
        `}\n`;

      iconClasses.push([`src-icon--${kebabName}`, css]);
    } catch (err) {
      console.error(
        `failed to generate icon CSS for ${path.basename(fullPath)}`,
      );

      throw err;
    }
  }

  let css = "";

  iconClasses.forEach(([_, classDecl]) => {
    css += classDecl + "\n\n";
  });

  css = await tidyCss(css);

  const distPath = getDistPath(getMetaUrlDir(import.meta.url));
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, css);
})();
