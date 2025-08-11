import chokidar from "chokidar";
import { execSync } from "child_process";

const run = (component) => {
  if (component) {
    console.log(`🛠  Rebuilding component: ${component}`);
  } else {
    console.log("🛠  Rebuilding all...");
  }

  let command = "node ./scripts/run-generators.js";

  if (component) {
    command += ` ${component}`;
  }

  try {
    execSync(command, { stdio: "inherit" });
    console.log("✅ Build complete");
  } catch (err) {
    console.error("❌ Build failed:", err.message);
  }
};

const watcher = chokidar.watch("./src", {
  persistent: true,
  ignoreInitial: false,
});

watcher.on("ready", () => {
  console.log("👀 Watching for changes in ./src");
  run();

  watcher.on("all", (event, path) => {
    // TODO: match "button" from "src/button/generate.js" in path.
    const component = path.match(/src\/([^/]+)\/generate\.js$/)?.[1];

    if (component) {
      console.log(`🔄 Detected change in component: ${component}`);
      console.clear();
      run(component);
    } else {
      console.log(`🔁 Detected ${event} in ${path}`);
      console.clear();
      run();
    }
  });
});
