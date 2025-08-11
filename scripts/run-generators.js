import { globSync } from "fs";
import { execSync } from "child_process";

const args = process.argv.slice(2);

let pattern;

if (args.length === 1) {
  pattern = `./src/${args[0]}/generate.js`;
} else if (args.length > 0) {
  const joined = args.map((name) => name.replace(/[|()]/g, "")).join("|");
  pattern = `./src/(${joined})/generate.js`;
} else {
  pattern = "./src/**/generate.js";
}

const files = globSync(pattern);

// TODO: run concurrently?
files.forEach((file) => {
  execSync(`node ${file}`, { stdio: "inherit" });
});
