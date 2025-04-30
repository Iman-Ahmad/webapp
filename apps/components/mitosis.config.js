// mitosis.config.js
const { defineConfig } = require('@builder.io/mitosis/config');

module.exports = defineConfig({
  files: 'src/**/*.lite.tsx',
  targets: [
    { 
      name: 'react',
      output: './output/react' 
    },
    { 
      name: 'vue',
      output: './output/vue' 
    },
    { 
      name: 'solid',
      output: './output/solid' 
    },
    { 
      name: 'svelte',
      output: './output/svelte' 
    }
  ]
});