// const recursive = require('inquirer-recursive');

module.exports = function (plop) {
  plop.setGenerator('screen', {
      description: 'React component using Typescript',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Name: ',
        }
        // {
        //   type: 'recursive',
        //   name: 'components',
        //   message: 'Add a new component ?',
        //   prompts: [
        //       {
        //     type: 'input',
        //     name: 'name',
        //     message: 'Name :',
        //     validate: function (value) { return true;
        //       // if ((/.+/).test(value)) { return true; }
        //       // return 'name is required';
        //     }
        //   }
        ///////
        //   ]
        // },
      ],
      actions: [
        {
          type: 'add',
          path: 'C:/Users/BOUCHRA/Desktop/example/src/templates/{{properCase name}}Template.js',
          templateFile: 'plop_templates/screen/template.js.hbs',
        },
        {
          type: 'append',
          path: 'C:/Users/BOUCHRA/Desktop/example/src/templates/index.js',
          template: 'export {default as {{ properCase name }}Template, } from "./{{ properCase name }}Template";'
        },
        {
          type: 'add',
          path: 'C:/Users/BOUCHRA/Desktop/example/src/screens/{{properCase name}}.js',
          templateFile: 'plop_templates/screen/screen.js.hbs',
        },
        {
          type: 'append',
          path: 'C:/Users/BOUCHRA/Desktop/example/src/screens/index.js',
          template: 'export {default as {{ properCase name }}, } from "./{{ properCase name }}";'
        }
        // {
        //   type: 'addMany',
        //   destination: 'C:/Users/BOUCHRA/Desktop/src/screens/{{name}}',
        //   templateFiles: 'plop_templates/screen/*.hbs',
        //   base: 'plop_templates/screen',
        // }
      ]
  });
};
