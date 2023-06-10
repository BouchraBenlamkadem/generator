const fs = require("fs");
const { execSync } = require("child_process");
const process = require("process");
const {resolve} = require('path');
const axios = require('axios'); 

module.exports = {
  description: 'Generate a React Native project',
  prompts: [
    {
      type: "input",
      name: "config",
      message: "Config file path: (default)",
    },
    {
      type: "password",
      mask: "*",
      name: "token",
      message: "Reference repository token:",
      validate: (value) => value?.length>0
    },
    {
      type: "checkbox",
      name: "packages",
      message: "Packages to install",
      choices: [
        { name: 'React Navigation', value: 'navigation' },
        { name: 'Local Storage', value: 'storage' },
        { name: 'Sqlite Database', value: 'db' },
        { name: 'Redux', value: 'redux' },
        { name: 'Axios', value: 'axios' },
        { name: 'Formik', value: 'forms' },
        { name: 'Date-fns', value: 'date' },
        { name: 'RNSVG', value: 'svg' },
        { name: 'RNSVG-animations', value: 'svg_animations' },
      ],
    }
  ],
  actions: function (_data) {
    const defaultConfigPath = resolve('./configs/project.json');
    let data = JSON.parse(fs.readFileSync((_data.config?.length>0 ? _data.config : defaultConfigPath).trim()));

    // 1. Project init
    execSync(`npx react-native init ${data.name}`,{
      cwd: data.path,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
  
    // 2. install packages
    let packages = [
      // UI
      "react-native-fast-image",
      "react-native-linear-gradient",
      "react-native-splash-screen",
      "react-native-vector-icons"
    ]
    _data.packages.includes('navigation') && 
      packages.push(
        "@react-navigation/native",
        "react-native-screens",
        "react-native-safe-area-context",
        "@react-navigation/native-stack"
      )
    _data.packages.includes('storage') && 
      packages.push(
        "@react-native-async-storage/async-storage"
      )
    _data.packages.includes('db') && 
      packages.push(
      "react-native-sqlite-storage",
      "@types/react-native-sqlite-storage"
      )
    _data.packages.includes('redux') && 
      packages.push(
        "react-redux",
        "@reduxjs/toolkit"
      )
    _data.packages.includes('axios') && 
      packages.push(
        "axios",
        "base-64",
      "@types/base-64",
      )
    _data.packages.includes('forms') && 
      packages.push(
        "formik",
        "yup"
      )
    _data.packages.includes('date') && 
      packages.push(
        "date-fns"
      )
    
    _data.packages.includes('svg') && 
      packages.push(
        "react-native-svg",
      )
    
    _data.packages.includes('svg_animations') && 
      packages.push(
        "react-native-svg-animations"
      )
    
    execSync(`npm install ${packages.join(' ')}`,{
      cwd: data.path + data.name,
      stdio: ['inherit', 'inherit', 'inherit'],
    })

    let dev_packages = [
      "babel-plugin-module-resolver",
      "eslint-config-prettier ",
      "eslint-import-resolver-babel-module ",
      "eslint-plugin-import ",
      "eslint-plugin-prettier ",
      "eslint-plugin-react ",
      "eslint-plugin-react-hooks ",
      "eslint-plugin-unused-imports ",
      "@types/node",
      "@testing-library/react-native",
      "handlebars-helpers",
      "plop"
    ]
    execSync(`npm install --save-dev ${dev_packages.join(' ')}`,{
      cwd: data.path + data.name,
      stdio: ['inherit', 'inherit', 'inherit'],
    })

    // 3. Add scripts 
    const package_json_path = resolve(data.path+data.name+'/package.json');
    const package_json = require(package_json_path);
    Object.assign(package_json.scripts,{
      "bundle-android": "react-native bundle --entry-file index.js  --platform android --dev false --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res",
      "release-build": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ && cd android && gradlew assembleRelease && cd ..",
      "release-bundle": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ && cd android && gradlew bundleRelease && cd ..",
      "build:ios": "react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'",
      "plop": "cd plop && plop"
    })
    fs.writeFileSync(package_json_path, JSON.stringify(package_json, null, 2));

    // 4. Hierarchy & Initial content
    let actions= []

    const emptyFiles = [
      'src/assets/fonts/index.tsx',
      'src/assets/icons/index.tsx',
      'src/assets/images/index.tsx',
      'src/components/index.tsx',
      'src/screens/index.tsx',
      'src/services/index.tsx',
      'src/slices/index.tsx',
      'src/store/middleware/index.tsx',
      'src/templates/index.tsx',
      'src/utils/helpers.tsx',
      'src/utils/queries.tsx',
      'src/utils/synchronisation.tsx',
    ];
    
    const initiatedFiles = [
      'src/animations/transitions.tsx',
      'src/animations/index.tsx',
      // 'src/components/Common/Alert.tsx',
      // 'src/components/Common/Button.tsx',
      // 'src/components/Common/Card.tsx',
      // 'src/components/Common/Header.tsx',
      // 'src/components/Auth/Input.tsx',
      // 'src/components/Common/Message.tsx',
      'src/components/Common/StatusBar.tsx',
      'src/components/Common/Loader.tsx',
      'src/styles/index.tsx',
      'src/styles/colors.tsx',
      'src/styles/mixins.tsx',
      'src/styles/spacing.tsx',
      'src/styles/typography.tsx',
      'src/utils/index.tsx',
      'src/utils/api.tsx',
      'src/utils/database.tsx',
      'src/utils/localStorage.tsx',
      'src/utils/rootNavigation.tsx',
      '.eslintrc.js',
      '.prettierrc.js',
      'editor.settings.jsonc',
      'babel.config.js',
      'tsconfig.json',
      ".vscode/settings.json",
      "plop/plopfile.js",
      "plop/generators/component.js",
      "plop/templates/Components.hbs",
      "plop/templates/Components.test.hbs",
    ];
    
    [...emptyFiles,...initiatedFiles].forEach(file => {
      actions.push({
        type: 'add',
        path: `{{ path }}/{{ name }}/${file}`,
        template:"export const _default = null",
        data,
        skipIfExists: true
      })
    });
    
    initiatedFiles.forEach(file => {
      actions.push({
        type: 'modify',
        path: `{{ path }}/{{ name }}/${file}`,
        transform: async (content, _) => {
          const url = `https://${_data.token}@${data.referenceRepositoryUrl}/${file}`;
          try {
            let response = (await axios.get(url)).data;
            return typeof response == 'string' ? response: JSON.stringify(response,null,2);
          } catch (error) {
            console.log('error!',error);
          }
          return '';
        },
        data,
        
      })
    });
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/navigations/index.tsx",
      templateFile: "plop_templates/project/navigations/index.tsx.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/slices/InfoSlice.tsx",
      templateFile: "plop_templates/project/slices/InfoSlice.tsx.hbs",
      data,
    })
      
    actions.push({
      type: "append",
      path: "{{ path }}/{{ name }}/src/slices/index.tsx",
      template:
        'import * as InfoSlice from "./InfoSlice";\nexport { InfoSlice };',
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/store/index.tsx",
      templateFile: "plop_templates/project/store/index.tsx.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/utils/constants.tsx",
      templateFile: "plop_templates/project/utils/constants.tsx.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/App.tsx",
      templateFile: "plop_templates/project/App.tsx.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/Initiator.tsx",
      templateFile: "plop_templates/project/Initiator.tsx.hbs",
      data,
    })

    // 5. Start app 
    actions.push(
      function () {
        fs.renameSync(`${data.path}${data.name}/src/App.tsx`, `${data.path}${data.name}/App.tsx`);

        execSync(`npm run android`,{
          cwd: data.path + data.name,
          stdio: ['inherit', 'inherit', 'inherit'],
        })
        child.stdout.on('data', (data) => { console.log(`stdout: ${data}`); });
        child.stderr.on('data', (data) => { console.error(`stderr: ${data}`); });
      }
    )
    
    return actions;
  }
}