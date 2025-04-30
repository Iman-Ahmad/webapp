// mitosis.config.js
import { defineConfig } from '@builder.io/mitosis/config';

export default defineConfig({
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