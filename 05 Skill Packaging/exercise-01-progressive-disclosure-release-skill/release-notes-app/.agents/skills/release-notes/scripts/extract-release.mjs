#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const entries = process.argv.slice(2);
const args = Object.fromEntries(Array.from({ length: Math.ceil(entries.length / 2) }, (_, index) => entries.slice(index * 2, index * 2 + 2)));
const repo = args["--repo"];
const base = args["--base"];
const head = args["--head"];

if (!repo || !base || !head) {
  console.error("Usage: extract-release.mjs --repo <path> --base <ref> --head <ref>");
  process.exit(2);
}

const git = (...gitArgs) => execFileSync("git", ["-C", repo, ...gitArgs], { encoding: "utf8" }).trim();

try {
  const commits = git("log", "--reverse", "--format=%H%x1f%s", `${base}..${head}`)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [sha, subject] = line.split("\u001f");
      const files = git("diff-tree", "--no-commit-id", "--name-only", "-r", sha).split(/\r?\n/).filter(Boolean).sort();
      return { sha, subject, files };
    });
  const changedFiles = git("diff", "--name-only", `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
  console.log(JSON.stringify({ range: { base, head }, commits, changedFiles }, null, 2));
} catch (error) {
  console.error(`Unable to inspect Git range ${base}..${head}: ${error.stderr?.toString().trim() || error.message}`);
  process.exit(1);
}
