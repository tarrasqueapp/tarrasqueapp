#!/usr/bin/env npx ts-node --esm --compilerOptions={"module":"ESNext","target":"ESNext","moduleResolution":"node"}
import 'dotenv/config';
import { argv, cd, fs, globby } from 'zx';

import { appPath, commandsPath, pluginsPath } from './helpers.mjs';

cd(appPath);

process.env.FORCE_COLOR = 'true';

async function main() {
  const command = argv._[0];

  // Show version
  if (argv.version || argv.v) {
    // Get the version from package.json
    const packageJson = await fs.readJson(`${appPath}/package.json`);
    console.info(`Tarrasque CLI v${packageJson.version}`);
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
  for (const plugin of plugins) {
    const json = await fs.readJson(plugin);
    const packageJson = await fs.readJson(`${pluginsPath}/${json.name}/package.json`);
    commands[json.command] = () => import(`${pluginsPath}/${json.name}/${packageJson.main}`);
  }

  const foundCommand = commands[command];

  // Show help if no command is found or the command is not found while the help flag is set
  if (!foundCommand) {
    console.info(`
    Usage
      $ tarrasque <command>

    Available commands
      ${Object.keys(commands).join(', ')}

    Options
      --version, -v   Version number
      --help, -h      Displays this message

    For more information run a command with the --help flag
      $ tarrasque dev --help
  `);
    process.exit(0);
  }

  foundCommand();
}
main();
