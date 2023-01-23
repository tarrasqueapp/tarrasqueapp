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

  // Check what package manager to use (pnpm, yarn, npm)
  const packageManager = (await fs.pathExists(`${pluginsPath}/${plugin}/pnpm-lock.yaml`))
    ? 'pnpm'
    : (await fs.pathExists(`${pluginsPath}/${plugin}/yarn.lock`))
    ? 'yarn'
    : 'npm';

  cd(`${pluginsPath}/${plugin}`);
  await $`git pull`;
  await $`${packageManager} install`;

  echo(`✅ Updated!`);
}
main();
