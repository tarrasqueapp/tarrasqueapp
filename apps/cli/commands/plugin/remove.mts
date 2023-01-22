import { $, argv, cd, echo, fs } from 'zx';

import { pluginsPath } from '../../helpers.mjs';

async function main() {
  const plugin = argv._[2];

  if (!plugin || argv.help || argv.h) {
    echo(`
    Description
      Removes a Tarrasque plugin.

    Usage
      $ tarrasque plugin remove <plugin>

    <plugin> represents the name of the plugin to remove.
    Must match the name of the plugin's directory.
  `);
    process.exit(0);
  }

  if (plugin.startsWith('/') || !(await fs.pathExists(`${pluginsPath}/${plugin}`))) {
    echo(`🚨 Plugin not found: ${plugin}`);
    process.exit(1);
  }

  cd(pluginsPath);
  await $`rm -rf ${plugin}`;

  echo(`✅ Removed!`);
}
main();
