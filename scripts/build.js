import { $ } from 'zx';

export async function build(frameworks, parallel = true) {
  const buildResults = {};

  if (parallel) {
    await Promise.all(
      frameworks.map(async (framework) => {
        buildResults[framework] = await buildFramework(framework);
      })
    );
  } else {
    for (const framework of frameworks) {
      buildResults[framework] = await buildFramework(framework);
    }
  }

  return buildResults;
}

export async function buildFramework(framework) {
  const start = Date.now();
  await $`cd frameworks/${framework} && npm run build`;
  return Date.now() - start;
}
