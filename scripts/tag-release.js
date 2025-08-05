#!/usr/bin/env node

import readline from "readline";
import { execSync } from "child_process";

try {
  const today = getToday();
  const existingTags = getExistingTags(today);
  const nextPatch = determineNextPatch(existingTags);
  const tag = `${today}-${nextPatch}`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`✨ Creating tag: ${tag}`);
  execSync(`git tag ${tag}`);

  rl.question("🚀 Push tag to GitHub and trigger release? (y/n) ", (answer) => {
    answer = answer.toLowerCase();

    if (answer === "y" || answer === "yes") {
      // execSync(`git push origin ${tag}`);
      console.log(`✅ Tag pushed to GitHub: ${tag}`);
    } else {
      console.log(
        "❎ Tag not pushed. Push it when you're ready to publish this version.",
      );
      process.exit(1);
    }

    rl.close();
  });
} catch (err) {
  console.error(`❌ Failed to create tag:`, err.message);
  process.exit(1);
}

function getToday() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd}`;
}

function getExistingTags(prefix) {
  return execSync(`git tag --list "${prefix}-*"`)
    .toString()
    .split("\n")
    .map((tag) => tag.trim())
    .filter((tag) => tag.startsWith(prefix));
}

function determineNextPatch(tagsToday) {
  const patches = tagsToday
    .map((tag) => parseInt(tag.split("-")[1], 10))
    .filter((n) => !isNaN(n));

  return patches.length ? Math.max(...patches) + 1 : 1;
}
