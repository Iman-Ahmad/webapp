import { $ } from 'zx';
import { getFrameworks } from './get-frameworks.js';

const noInstallFrameworks = new Set(['.DS_Store']);

export async function install(framework, packageName = '') {
  return $`cd frameworks/${framework} && pnpm i ${packageName || ''}`;
}

export async function installAll(frameworks) {
  frameworks = await getFrameworks();
  return Promise.all(
    frameworks
      .filter((framework) => !noInstallFrameworks.has(framework))
      .map((framework) => install(framework))
  );
}
