import { themeCheckbox } from "@guardian/source/react-components";

import {
  loadSourceContext,
  getDistPath,
  getMetaUrlDir,
  getFullPathFor,
  writeLabelClasses,
  makeDecl,
  removeBacktickMarkupWhitespace,
} from "../utils.js";

(async () => {
  const context = loadSourceContext(
    getFullPathFor("react-components/checkbox/styles.js"),
  );

  // NOTE: this isn't a pixel-perfect match of the source checkbox, but it's close enough
  const tickSvg = removeBacktickMarkupWhitespace(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
  <path d='M 8,16.5 L13,21.5 L 23.5,10.5' stroke='${themeCheckbox.fillSelected}' stroke-width='2.6' fill='none'/>
</svg>`);

  const checkboxClasses = [
    // TODO: rename "__field"?
    makeDecl(
      ".src-checkbox__container",
      context.checkboxContainer(themeCheckbox),
    ),

    // TODO: should we bin the @supports stuff from this and just require appearance: none?
    makeDecl(".src-checkbox", context.checkbox(themeCheckbox)),

    // We use mask-image to do the little wipe-in/out animation with the checkbox's checked state
    makeDecl(
      ".src-checkbox::after",
      `
        content: url("data:image/svg+xml,${encodeURIComponent(tickSvg)}");
        height: 24px;
        width: 24px;
        left: -1px;
        top: -1px;
        position: absolute;

        mask-image: linear-gradient(to right, black 50%, transparent 50%);
        mask-repeat: no-repeat;
        mask-size: 200% 100%;
        mask-position: 100% 0;
        transition: mask-position 0.18s ease-in-out;

        pointer-events: none;
     `,
    ),

    // When inside the container, the border is always drawn, so offset tick accordingly
    makeDecl(
      ".src-checkbox__container:hover .src-checkbox::after",
      `
        left: -2px;
        top: -2px;
     `,
    ),

    makeDecl(
      ".src-checkbox:checked::after",
      `
        left: -2px;
        top: -2px;
        mask-position: 0% 0;
      `,
    ),

    makeDecl(".src-checkbox:indeterminate::after", `mask-image: unset;`),

    // NOTE: checkboxes have their own label style, so we can't use the label.css
    makeDecl(".src-checkbox ~ .src-label", context.labelText(themeCheckbox)),

    makeDecl(
      ".src-checkbox ~ .src-label .src-label__supporting",
      context.supportingText(themeCheckbox),
    ),
  ];

  writeLabelClasses(
    checkboxClasses,
    getDistPath(getMetaUrlDir(import.meta.url)),
  );
})();
