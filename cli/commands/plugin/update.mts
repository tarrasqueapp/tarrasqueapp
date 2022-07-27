import { $, argv, cd, echo, fs } from 'zx';

import { pluginsPath } from '../../helpers.mjs';

async function main() {
  const plugin = argv._[2];

  if (!plugin || argv.help || argv.h) {
    echo(`
    Description
      Updates a Tarrasque plugin to the latest version.

    Usage
      $ tarrasque plugin update <plugin>

    <plugin> represents the name of the plugin to update.
    Must match the name of the plugin's directory.
  `);
    process.exit(0);
  }

  if (!(await fs.pathExists(`${pluginsPath}/${plugin}`))) {
    echo(`🚨 Plugin not found: ${plugin}`);
    process.exit(1);
  }

  cd(`${pluginsPath}/${plugin}`);
  await $`git pull`;
  await $`yarn`;

  echo(`✅ Updated!`);
}
main();
