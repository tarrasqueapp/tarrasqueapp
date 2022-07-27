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
      cd(`${pluginsPath}/${dirent.name}`);
      await $`git pull`;
      await $`yarn`;
    }
  }

  echo(`✅ Updated!`);
}
main();
