import { themeSelect } from "@guardian/source/react-components";

import {
  loadSourceContext,
  getDistPath,
  getMetaUrlDir,
  getFullPathFor,
  writeLabelClasses,
  makeDecl,
  parseCss,
  removeBacktickMarkupWhitespace,
} from "../utils.js";

// TODO: support small?

(async () => {
  const context = loadSourceContext(
    getFullPathFor("react-components/select/styles.js"),
  );

  const selectStylesRoot = await parseCss(context.select(themeSelect).styles);
  selectStylesRoot.nodes.forEach((node) => {
    // Remove the `@supports (appearance: none) { ... }` rule: supporting this is a requirement for this library
    if (
      node.type === "atrule" &&
      node.name === "supports" &&
      node.params.includes("appearance: none")
    ) {
      node.remove();
    }
  });

  const selectWrapperStylesRoot = await parseCss(
    context.selectWrapper(themeSelect).styles,
  );

  /** @type {import('postcss').Rule} */
  let arrowIconRule;

  // Steal rule for the SVG icon that we're going to add via a data URL instead
  selectWrapperStylesRoot.nodes.forEach((node) => {
    if (node.type === "rule" && node.selector === "svg") {
      arrowIconRule = node.clone();
      node.remove();
    }
  });

  arrowIconRule.nodes.forEach((node) => {
    // Remove "display: none" and "fill: #...", we don't need them anymore
    if (
      node.type === "decl" &&
      (node.prop === "display" || node.prop === "fill")
    ) {
      node.remove();
    }
  });

  const arrowSvg = removeBacktickMarkupWhitespace(`
    <svg viewBox="-3 -3 30 30" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" fill="${themeSelect.textUserInput}" clip-rule="evenodd" d="m1 7.224 10.498 10.498h1.004L23 7.224l-.98-.954L12 14.708 1.98 6.27z">
      </path>
    </svg>
  `);

  const selectClasses = [
    makeDecl(".src-select__wrapper", selectWrapperStylesRoot.toString()),

    makeDecl(
      ".src-select__wrapper::after",
      `
        content: url("data:image/svg+xml,${encodeURIComponent(arrowSvg)}");
     `,
      arrowIconRule.nodes.join(";\n"),
    ),

    makeDecl(".src-select", selectStylesRoot.toString(), `appearance: none;`),

    // NOTE: the actual Source component seems to use the incorrect margin-top when used with a label without supporting text (it uses 6px, when the other inputs use 4px, eg. text-input) - here, we use the correct 4px margin-top
    // NOTE: when we get to adding success/error feedback, this'll need to be moved to the container, the way the actual Select component does it
    makeDecl(
      `.src-label + .src-select__wrapper`,
      `margin-top: ${context.space[1]}px`,
    ),

    // TODO: can we do this without :has()? at least, we should document that this use of :has() is a progessive enhancement, we'll fall back to the above margin if it's not available, which isn't so bad
    makeDecl(
      `.src-label:has(.src-label__supporting) + .src-select__wrapper`,
      context.supportingTextMargin.styles,
    ),
  ];

  writeLabelClasses(selectClasses, getDistPath(getMetaUrlDir(import.meta.url)));
})();
