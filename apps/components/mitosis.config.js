module.exports = {
  files: 'src/**/*.lite.tsx',
  targets: [
    { name: 'react', output: '/output/react' },  // Explicit mapping
    { name: 'vue', output: '/output/vue' },
    { name: 'solid', output: '/output/solid' },
    { name: 'svelte', output: '/output/svelte' }
  ]
};