#!/usr/bin/env -S npx ts-node --esm
import { argv, cd, echo, fs, globby } from 'zx';

import { appPath, commandsPath, pluginsPath } from './helpers.mjs';

cd(appPath);

process.env.FORCE_COLOR = 'true';

async function main() {
  const command = argv._[0];

  // Show version
  if (argv.version || argv.v) {
    // Get the version from package.json
    const packageJson = await fs.readJson(`${appPath}/package.json`);
    echo(`Tarrasque CLI v${packageJson.version}`);
    process.exit(0);
  }

  // Set built-in commands
  const commands: { [key: string]: () => Promise<void> } = {};
  // Get all files in the commands directory
  const files = await fs.readdir(commandsPath, { withFileTypes: true });
  // Map all files to their command name
  for (const dirent of files) {
    // Check if the file is a directory
    if (dirent.isDirectory()) {
      // Map the index file as the command name
      commands[dirent.name] = () => import(`${commandsPath}/${dirent.name}/index.mjs`);
    } else {
      // Remove the .mjs extension
      const commandName = dirent.name.replace(/\.m(j|t)s$/, '');
      // Add the command
      commands[commandName] = () => import(`${commandsPath}/${dirent.name}`);
    }
  }

  // Get all plugin commands
  const plugins = await globby([`${pluginsPath}/*/tarrasque.json`]);
  for (const pluginPath of plugins) {
    const pluginFile = await fs.readFile(pluginPath);
    const plugin = JSON.parse(pluginFile.toString());
    if (!plugin.cli?.command || !plugin.cli?.entrypoint) continue;
    commands[plugin.cli.command] = () => import(`${pluginsPath}/${plugin.id}/${plugin.cli.entrypoint}`);
  }

  const foundCommand = commands[command];

  // Show help if no command is found or the command is not found while the help flag is set
  if (!foundCommand) {
    echo(`
    Usage
      $ tarrasque <command>

    Available commands
      ${Object.keys(commands).join(', ')}

    Options
      --version, -v   Version number
      --help, -h      Displays this message

    For more information run a command with the --help flag
      $ tarrasque docker --help
  `);
    process.exit(0);
  }

  foundCommand();
}
main();
