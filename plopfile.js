const helpers = require("./helpers");
const recursive = require("inquirer-recursive");

module.exports = function (plop) {
  plop.setPrompt("recursive", recursive);
  for (const helper in helpers) {
    plop.setHelper(helper, helpers[helper]);
  }
  plop.setGenerator("screen", {
    description: "React component using Typescript",
    prompts: [
      {
        type: "input",
        name: "path",
        message: "Src path: ",
      },
      {
        type: "input",
        name: "name",
        message: "Name: ",
      },
      {
        type: "recursive",
        message: "Add a new prop ?",
        name: "props",
        prompts: [
          {
            type: "list",
            name: "source",
            message: "What is the prop source ?",
            choices: () => [
              {
                name: "Add the prop from route",
                value: "route",
              },
              {
                name: "Add the prop from state",
                value: "state",
              },
            ],
          },
          {
            when: (answer) => answer.source === "state",
            type: "input",
            name: "slice",
            message: "Slice: ",
          },
          {
            when: (answer) => answer.source === "state",
            type: "confirm",
            name: "new",
            message: "Is it a new state object ?",
          },
          {
            type: "input",
            name: "name",
            message: "Prop name: ",
          },
          {
            when: (answer) => answer.new,
            type: "input",
            name: "initial",
            message: "Prop initial value: ",
          },
        ],
      },
    ],
    actions: function (data) {
      let actions = [
        {
          type: "add",
          path: "{{path}}/templates/{{properCase name}}Template.js",
          templateFile: "plop_templates/screen/template.js.hbs",
        },
        {
          type: "append",
          path: "{{path}}/templates/index.js",
          template:
            'export {default as {{ properCase name }}Template, } from "./{{ properCase name }}Template";',
        },
        {
          type: "add",
          path: "{{path}}/screens/{{properCase name}}.js",
          templateFile: "plop_templates/screen/screen.js.hbs",
        },
        {
          type: "append",
          path: "{{path}}/screens/index.js",
          template:
            'export {default as {{ properCase name }}, } from "./{{ properCase name }}";',
        },
      ];
      data.props.forEach((prop) => {
        if (prop.new) {
          actions.push({
            type: "append",
            path: `{{path}}/slices/${helpers.capitalize(prop.slice)}Slice.js`,
            template: `    ${prop.name}:${prop.initial},`,
            pattern: "initialState: {",
          });
          // actions.push({
          //   type: "add",
          //   path: `{{path}}/slices/${prop.slice}Slice.js`,
          //   templateFile: "plop_templates/screen/slice.js.hbs",
          // });
          // actions.push({
          //   type: "append",
          //   path: "{{path}}/slices/index.js",
          //   template: `export {default as ${prop.slice}Slice, } from "./${prop.slice}Slice";`,
          // });
        }
      });

      return actions;
    },
  });
};
