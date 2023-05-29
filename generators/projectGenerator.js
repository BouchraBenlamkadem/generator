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
      "react-native-sqlite-storage"
      )
    _data.packages.includes('redux') && 
      packages.push(
        "react-redux",
        "@reduxjs/toolkit"
      )
    _data.packages.includes('axios') && 
      packages.push(
        "axios",
        "base-64"
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

    // 3. Add scripts 
    const package_json_path = resolve(data.path+data.name+'/package.json');
    const package_json = require(package_json_path);
    Object.assign(package_json.scripts,{
      "bundle-android": "react-native bundle --entry-file index.js  --platform android --dev false --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res",
      "release-build": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ && cd android && gradlew assembleRelease && cd ..",
      "release-bundle": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ && cd android && gradlew bundleRelease && cd ..",
      "build:ios": "react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'"
    })
    fs.writeFileSync(package_json_path, JSON.stringify(package_json, null, 2));

    // 4. Hierarchy & Initial content
    let actions= []

    const emptyFiles = [
      'src/assets/fonts/index.js',
      'src/assets/icons/index.js',
      'src/assets/images/index.js',
      'src/components/index.js',
      'src/screens/index.js',
      'src/services/index.js',
      'src/slices/index.js',
      'src/store/middleware/index.js',
      'src/templates/index.js',
      'src/utils/helpers.js',
      'src/utils/queries.js',
      'src/utils/synchronisation.js',
      // 'Initiator.js',
    ];
    
    const initiatedFiles = [
      'src/animations/transition.js',
      'src/animations/index.js',
      'src/components/Common/Alert.js',
      'src/components/Common/Button.js',
      'src/components/Common/Card.js',
      'src/components/Common/Header.js',
      'src/components/Auth/Input.js',
      'src/components/Common/Message.js',
      'src/components/Common/StatusBar.js',
      'src/components/Auth/Loader.js',
      // 'src/navigations/index.js',
      // 'src/store/index.js',
      'src/styles/index.js',
      'src/styles/colors.js',
      'src/styles/mixins.js',
      'src/styles/spacing.js',
      'src/styles/typography.js',
      'src/utils/index.js',
      'src/utils/api.js',
      // 'src/utils/constants.js',
      'src/utils/database.js',
      'src/utils/localStorage.js',
      'src/utils/rootNavigation.js',
      '.eslintrc.js',
      '.prettierrc.js',
      'editor.settings.jsonc',
      'jsconfig.json',
    ];
    
    [...emptyFiles,...initiatedFiles].forEach(file => {
      actions.push({
        type: 'add',
        path: `{{ path }}/{{ name }}/${file}`,
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
      path: "{{ path }}/{{ name }}/src/navigations/index.js",
      templateFile: "plop_templates/project/navigations/index.js.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/slices/InfoSlice.js",
      templateFile: "plop_templates/project/slices/InfoSlice.js.hbs",
      data,
    })
      
    actions.push({
      type: "append",
      path: "{{ path }}/{{ name }}/src/slices/index.js",
      template:
        'import * as InfoSlice from "./InfoSlice";\nexport { InfoSlice };',
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/store/index.js",
      templateFile: "plop_templates/project/store/index.js.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/utils/constants.js",
      templateFile: "plop_templates/project/utils/constants.js.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/App.js",
      templateFile: "plop_templates/project/App.js.hbs",
      data,
    })
    
    actions.push({
      type: "add",
      path: "{{ path }}/{{ name }}/src/Initiator.js",
      templateFile: "plop_templates/project/Initiator.js.hbs",
      data,
    })
    
    // 5. Generate templates
    // data..forEach((prop) => {

    // . Start app 
    actions.push(
      function () {

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