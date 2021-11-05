const helpers = require("../helpers");
module.exports = {
  description: "React component using Typescript",
  prompts: [
    {
      type: "input",
      name: "config",
      message: "Config file path: ",
    },
  ],
  actions: function (data) {
    const fs = require("fs");

    const _data = fs.readFileSync(data.config.trim());
    let config = JSON.parse(_data);

    let actions = [
      {
        type: "add",
        path: "{{path}}/templates/{{properCase name}}Template.js",
        templateFile: "plop_templates/screen/template.js.hbs",
        data: config,
      },
      {
        type: "append",
        path: "{{path}}/templates/index.js",
        template:
          'export {default as {{ properCase name }}Template } from "./{{ properCase name }}Template";',
        data: config,
      },
      {
        type: "add",
        path: "{{path}}/screens/{{properCase name}}.js",
        templateFile: "plop_templates/screen/screen.js.hbs",
        data: config,
      },
      {
        type: "append",
        path: "{{path}}/screens/index.js",
        template:
          'export {default as {{ properCase name }} } from "./{{ properCase name }}";',
        data: config,
      },
    ];
    config.props.forEach((prop) => {
      if (prop.new) {
        actions.push({
          type: "append",
          path: `{{path}}/slices/${helpers.capitalize(prop.slice)}Slice.js`,
          template: `  ${prop.name}: ${prop.initial},`,
          pattern: "initialState = {",
          data: config,
        });
        actions.push({
          type: "append",
          path: `{{path}}/slices/${helpers.capitalize(prop.slice)}Slice.js`,
          // prettier-ignore
          template: `    reset${helpers.capitalize(prop.name)}: (state, action) => { state.${prop.name} = initialState.${prop.name}; },`,
          pattern: "reducers: {",
          data: config,
        });
        actions.push({
          type: "append",
          path: `{{path}}/slices/${helpers.capitalize(prop.slice)}Slice.js`,
          // prettier-ignore
          template: `    set${helpers.capitalize(prop.name)}: (state, action) => { state.${prop.name} = action.payload; },`,
          pattern: "reducers: {",
          data: config,
        });
      }
    });
    return actions;
  },
};
