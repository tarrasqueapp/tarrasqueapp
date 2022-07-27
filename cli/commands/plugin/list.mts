import { argv, echo, fs, globby } from 'zx';

import { pluginsPath } from '../../helpers.mjs';

async function main() {
  if (argv.help || argv.h) {
    echo(`
    Description
      Lists all installed Tarrasque plugins.

    Usage
      $ tarrasque plugin list
  `);
    process.exit(0);
  }

  // Get all plugins
  const plugins = await globby([`${pluginsPath}/*/tarrasque.json`]);
  // Get all plugin names, versions, and commands
  const data: Record<string, string>[] = [];
  for (const plugin of plugins) {
    const json = await fs.readJson(plugin);
    const packageJson = await fs.readJson(`${pluginsPath}/${json.name}/package.json`);
    data.push({ name: json.name, version: packageJson.version, command: json.command });
  }

  echo(`
  Installed plugins:
    ${data.map(({ name, version, command }) => `${name}@${version} (${command})`).join('\n    ')}
  `);
}
main();
