const helpers = require("./helpers");
const recursive = require("inquirer-recursive");

const screenGenerator = require("./generators/screenGenerator");
const generator = require("./generators/Generator");

module.exports = function (plop) {
  plop.setPrompt("recursive", recursive);
  for (const helper in helpers) {
    plop.setHelper(helper, helpers[helper]);
  }
  plop.setGenerator("screen", screenGenerator);
  plop.setGenerator("generator", generator);
};
