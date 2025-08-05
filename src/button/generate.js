import {
  loadSourceContext,
  classTuple,
  getDistPath,
  getMetaUrlDir,
  tidyCss,
  getFullPathFor,
} from "../utils.js";

import * as fs from "fs";
import * as path from "path";

(async () => {
  const context = loadSourceContext(
    getFullPathFor("react-components/button/styles.js"),
  );

  const theme = context.themeButton;

  const buttonClasses = [
    classTuple(
      "src-button",
      context.buttonStyles({ priority: "primary", size: "default" })(
        context.themeButton,
      ),
    ),

    classTuple("src-button--secondary", context.secondary(theme)),
    classTuple("src-button--tertiary", context.tertiary(theme)),
    classTuple("src-button--subdued", context.subdued(theme)),

    classTuple("src-button--small", context.smallSize),
    classTuple("src-button--xsmall", context.xsmallSize),
  ];

  let css = "";

  buttonClasses.forEach(([_, classDecl]) => {
    css += classDecl + "\n\n";
  });

  css = await tidyCss(css);

  const distPath = getDistPath(getMetaUrlDir(import.meta.url));
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, css);
})();
