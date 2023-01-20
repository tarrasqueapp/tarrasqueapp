import { $, argv, cd, echo, fs } from 'zx';

import { pluginsPath } from '../../helpers.mjs';

async function main() {
  if (argv.help || argv.h) {
    echo(`
    Description
      Updates all Tarrasque plugins to the latest version.

    Usage
      $ tarrasque plugin update-all
  `);
    process.exit(0);
  }

  // Get all files in the plugins directory
  const files = await fs.readdir(pluginsPath, { withFileTypes: true });
  // Loop through all files
  for (const dirent of files) {
    // Check if the file is a directory
    if (dirent.isDirectory()) {
      // Check what package manager to use (pnpm, yarn, npm)
      const packageManager = (await fs.pathExists(`${pluginsPath}/${dirent.name}/pnpm-lock.yaml`))
        ? 'pnpm'
        : (await fs.pathExists(`${pluginsPath}/${dirent.name}/yarn.lock`))
        ? 'yarn'
        : 'npm';

      cd(`${pluginsPath}/${dirent.name}`);
      await $`git pull`;
      await $`${packageManager} install`;
    }
  }

  echo(`✅ Updated!`);
}
main();
