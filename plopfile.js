const helpers = require("./helpers");
const component = require("./plop_templates/screen/partials/component");
const recursive = require("inquirer-recursive");

// Generators
const screenGenerator = require("./generators/screenGenerator");
const generator = require("./generators/Generator");
const project = require("./generators/projectGenerator");

module.exports = function (plop) {
  plop.setPrompt("recursive", recursive);
  for (const helper in helpers) {
    plop.setHelper(helper, helpers[helper]);
  }
  plop.setPartial("component", component);
  plop.setGenerator("screen", screenGenerator);
  plop.setGenerator("generator", generator);
  plop.setGenerator("project", project);
};
