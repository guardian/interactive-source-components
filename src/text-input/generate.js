import { themeTextInput } from "@guardian/source/react-components";

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
    getFullPathFor("react-components/text-input/styles.js"),
  );

  const textInputClasses = [
    classTuple(
      "src-text-input",
      context.textInput(themeTextInput, "medium"),
      context.widthFluid.styles,
    ),

    classTuple("src-text-input--small", context.inputSizeSmall.styles),

    classTuple("src-text-input--width-fluid", context.widthFluid.styles),
    classTuple("src-text-input--width-30", context.width30.styles),
    classTuple("src-text-input--width-10", context.width10.styles),
    classTuple("src-text-input--width-4", context.width4.styles),

    // Add margin above input according to preceding label element
    [
      "src-text-input",
      `.src-label + .src-text-input {\n` +
        `${context.labelMargin.styles}` +
        `}\n`,
    ],
    [
      "src-text-input",
      `label:has(.src-label) + .src-text-input {\n` +
        `${context.labelMargin.styles}` +
        `}\n`,
    ],
    [
      "src-text-input",
      `label:has(.src-label__supporting) + .src-text-input {\n` +
        `${context.supportingTextMargin.styles}` +
        `}\n`,
    ],
  ];

  writeLabelClasses(
    textInputClasses,
    getDistPath(getMetaUrlDir(import.meta.url)),
  );
})();
