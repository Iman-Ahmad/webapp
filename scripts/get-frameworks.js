import pkg from 'fs-extra';
const { fs } = pkg;  // Destructure fs from the default export

const FRAMEWORKS = process.env.FRAMEWORKS?.split(',');

const IGNORE_FRAMEWORKS = ['.DS_Store'].concat(
    process.env.IGNORE_FRAMEWORKS ? process.env.IGNORE_FRAMEWORKS.split(',') : []
  );


// Get the list of frameworks to test
export async function getFrameworks() {
  if (FRAMEWORKS) {
    return FRAMEWORKS;
  }

  const frameworks = await fs.readdir('./frameworks');
  return frameworks
    .filter((item) => !IGNORE_FRAMEWORKS.includes(item))
    .reverse();
}
