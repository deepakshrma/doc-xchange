/*
// How to use
curl -s https://gist.githubusercontent.com/deepakshrma/c77d297d5ff3e07ce172da2893bb49d0/raw/835f004cf234cf3a79fab1bd1b37df7db861773b/nodejs_init.js -O nodejs_init.js || node nodejs_init.js 
*/

const path = require("path");
const fs = require("fs");

const cwd = process.cwd();
const fromRoot = (...args) => path.join(cwd, ...args);

let json = require(fromRoot("package.json"));

const [srcPath = "src/"] = process.argv.slice(2);
const isForced = process.argv.indexOf("--force") !== -1;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;
const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
const red = (msg) => `\x1b[31m${msg}\x1b[0m`;

if (!json.husky) {
  json.husky = {
    hooks: {},
  };
}
json.husky.hooks["pre-commit"] = "lint-staged";
if (!json["lint-staged"]) json["lint-staged"] = {};
json["lint-staged"] = {
  ...json["lint-staged"],
  "*.{js,jsx,ts,tsx,md,html,css}": "prettier --write",
};
if (!json.devDependencies) json.devDependencies = {};
json.devDependencies = {
  ...json.devDependencies,
  husky: "^4.2.5",
  "lint-staged": "^10.2.2",
  prettier: "^2.0.5",
};
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const readLine = (question) =>
  new Promise((r) => {
    rl.question(yellow(question), (answer) => r(answer));
  });
// rl.close();
const jsonStr = JSON.stringify(json, null, 2);
(async function () {
  try {
    let answer = "Y";
    if (!isForced) {
      console.log(green(`New Config: \n${jsonStr}\n\n`));
      answer = await readLine("Do you want to overrride?(Y|n) ");
      console.log(green(`Answer:[${answer}]`));
    }
    if (answer !== "n") {
      fs.writeFileSync(fromRoot("package.json"), jsonStr);
      console.log(green(`Please run npm install`));
    }
  } catch (error) {
    console.error(red(error.message));
    // con;
  } finally {
    rl.close();
  }
})();
