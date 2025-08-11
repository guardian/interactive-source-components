import { themeLabel } from "@guardian/source/react-components";

import {
  loadSourceContext,
  classTuple,
  getDistPath,
  getMetaUrlDir,
  getFullPathFor,
  writeLabelClasses,
} from "../utils.js";

(async () => {
  const context = loadSourceContext(
    getFullPathFor("react-components/label/styles.js"),
  );

  const labelClasses = [
    classTuple(
      "src-label",
      context.labelText(themeLabel, "medium"),
      "display: block;",
    ),
    classTuple("src-label--small", context.textSize.small),
    classTuple("src-label__optional", context.optionalText(themeLabel)),
    classTuple("src-label__supporting", context.supportingText(themeLabel)),
  ];

  writeLabelClasses(labelClasses, getDistPath(getMetaUrlDir(import.meta.url)));
})();
