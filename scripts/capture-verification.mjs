import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(`${message}\nUsage: npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`);
  process.exit(2);
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function runGit(args) {
  const result = spawnSync("git", args, { cwd: process.cwd(), encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : "unavailable";
}

const separator = process.argv.indexOf("--", 2);
if (separator < 0 || separator === process.argv.length - 1) fail("A verification command must follow --.");

const options = process.argv.slice(2, separator);
const outputIndex = options.indexOf("--output");
const output = outputIndex >= 0 ? options[outputIndex + 1] : "";
if (!output) fail("Provide --output.");

const commandParts = process.argv.slice(separator + 1);
if (JSON.stringify(commandParts) !== JSON.stringify(["npm", "run", "evidence:verify"])) {
  fail("The captured command must be exactly: npm run evidence:verify");
}
const exerciseRoot = path.resolve(process.cwd(), "..");
const evidenceRoot = path.join(exerciseRoot, "evidence");
const outputPath = path.resolve(process.cwd(), output);
if (!isInside(evidenceRoot, outputPath) || path.extname(outputPath) !== ".txt") {
  fail("Output must be a .txt file inside this exercise's evidence directory.");
}
fs.mkdirSync(evidenceRoot, { recursive: true });
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const realEvidenceRoot = fs.realpathSync(evidenceRoot);
const realOutputPath = path.join(fs.realpathSync(path.dirname(outputPath)), path.basename(outputPath));
if (!isInside(realEvidenceRoot, realOutputPath)) fail("Output directory must not escape evidence through a link or junction.");
if (fs.existsSync(outputPath)) {
  if (fs.lstatSync(outputPath).isSymbolicLink()) fail("Output file must not be a symbolic link.");
  if (!isInside(realEvidenceRoot, fs.realpathSync(outputPath))) fail("Output file must not escape evidence through a link or junction.");
}

const startedAt = new Date();
const npmCli = process.env.npm_execpath;
const executable = npmCli ? process.execPath : "npm";
const commandArguments = npmCli ? [npmCli, "run", "evidence:verify"] : ["run", "evidence:verify"];
const result = spawnSync(executable, commandArguments, {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
});
const finishedAt = new Date();
const exitCode = Number.isInteger(result.status) ? result.status : 1;
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? result.error?.message ?? "";
const transcript = [
  `Command: ${commandParts.join(" ")}`,
  `Repository commit: ${runGit(["rev-parse", "HEAD"])}`,
  `Started at: ${startedAt.toISOString()}`,
  `Finished at: ${finishedAt.toISOString()}`,
  `Duration ms: ${Math.max(0, finishedAt.getTime() - startedAt.getTime())}`,
  "",
  "STDOUT",
  stdout.trimEnd(),
  "",
  "STDERR",
  stderr.trimEnd(),
  "",
  `exit code: ${exitCode}`,
  "",
].join("\n");

fs.writeFileSync(outputPath, transcript, "utf8");
if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);
console.log(`\nCaptured verification evidence in ${path.relative(process.cwd(), outputPath)} with exit code ${exitCode}.`);
process.exit(exitCode);
