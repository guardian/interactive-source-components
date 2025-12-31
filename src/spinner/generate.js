import { iconSize } from "@guardian/source/foundations";

import {
  loadSourceContext,
  getDistPath,
  getMetaUrlDir,
  getFullPathFor,
  writeLabelClasses,
} from "../utils.js";

(async () => {
  const themeContext = loadSourceContext(
    getFullPathFor("react-components/spinner/theme.js"),
  );

  const spinnerClasses = [
    [
      `spinner`,
      `.src-spinner {` +
        `\t--bg: ${themeContext.themeSpinner.background};\n` +
        `\t--fg: ${themeContext.themeSpinner.color};\n` +
        `\tdisplay: inline-block;\n` +
        `\tposition: relative;\n` +
        `\tborder-radius: 100%;\n` +
        `\twidth: ${iconSize.medium}px;\n` +
        `\theight: ${iconSize.medium}px;\n` +
        `\tbackground-color: var(--bg);\n` +
        `\tmask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='15' stroke='white' stroke-width='10' fill='none'/%3E%3C/svg%3E");\n` +
        `\tmask-repeat: no-repeat;\n` +
        `\tmask-size: cover;\n` +
        `\tanimation: spinnerBackgroundColor 3.5s steps(1, jump-end) infinite, spinnerRotate 2.5s linear infinite;\n` +
        `}\n` +
        `.src-spinner:after, .src-spinner:before {` +
        `\tcontent: "";\n` +
        `\theight: inherit;\n` +
        `\twidth: inherit;\n` +
        `\tmask-repeat: no-repeat;\n` +
        `\tmask-size: cover;\n` +
        `\tmask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M15,50 L15,0 A15,15 0 1,1 15,30 L15,15 Z'/%3E%3C/svg%3E");\n` +
        `\tposition: absolute;\n` +
        `}\n` +
        `.src-spinner:after {` +
        `\tbackground: var(--bg);\n` +
        `\tanimation: spinnerSegmentRotate 3.5s ease-in-out infinite calc(3.5s * 0.5), spinnerZIndexCycle1 3.5s steps(1, end) infinite;\n` +
        `}\n` +
        `.src-spinner:before {` +
        `\tbackground: var(--fg);\n` +
        `\tanimation: spinnerSegmentRotate 3.5s ease-in-out infinite, spinnerZIndexCycle2 3.5s steps(1, end) infinite;\n` +
        `}\n` +
        `@keyframes spinnerBackgroundColor {\n` +
        `\t25% { background-color: var(--fg); }\n` +
        `\t75% { background-color: var(--bg); }\n` +
        `}\n` +
        `@keyframes spinnerRotate {\n` +
        `\t100% { transform: rotate(360deg); }\n` +
        `}\n` +
        `@keyframes spinnerSegmentRotate {\n` +
        `\t0% { transform: rotate(0deg); }\n` +
        `\t50%,100% { transform: rotate(360deg); }\n` +
        `}\n` +
        // TODO: can we combine these two zCycle keyframes?
        `@keyframes spinnerZIndexCycle1 {\n` +
        `\t0% { z-index: 2; }\n` +
        `\t25%,75% { z-index: 1; }\n` +
        `\t100% { z-index: 2; }\n` +
        `}\n` +
        `@keyframes spinnerZIndexCycle2 {\n` +
        `\t0% { z-index: 1; }\n` +
        `\t25% { z-index: 2; }\n` +
        `\t75%,100% { z-index: 1; }\n` +
        `}\n`,
    ],
  ];

  const sizeContent = loadSourceContext(
    getFullPathFor("foundations/__generated__/size.js"),
  );

  for (let [name, pixels] of Object.entries(sizeContent.iconSize)) {
    spinnerClasses.push([
      `src-spinner--${name}`,
      `.src-spinner--${name} {` +
        `\twidth: ${pixels}px;\n` +
        `\theight: ${pixels}px;\n` +
        `}\n`,
    ]);
  }

  writeLabelClasses(
    spinnerClasses,
    getDistPath(getMetaUrlDir(import.meta.url)),
  );
})();
