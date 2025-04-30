module.exports = {
  files: 'src/**/*.lite.tsx',
  targets: [
    'react',
    'vue',
    'solid',
    'svelte'
  ],
  output: {
    react: './output/react',
    vue: './output/vue',
    solid: './output/solid',
    svelte: './output/svelte'
  }
};