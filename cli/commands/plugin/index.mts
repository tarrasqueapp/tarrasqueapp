import { argv } from 'zx';

async function main() {
  const commands: Record<string, () => Promise<unknown>> = {
    add: () => import('./add.mjs'),
    list: () => import('./list.mjs'),
    remove: () => import('./remove.mjs'),
    update: () => import('./update.mjs'),
    'update-all': () => import('./update-all.mjs'),
  };

  const command = argv._[1];
  const foundCommand = commands[command];

  if (!foundCommand) {
    console.info(`
    Usage
      $ tarrasque plugin <command>

    Available commands
      ${Object.keys(commands).join(', ')}

    Options
      --help, -h      Displays this message

    For more information run a command with the --help flag
      $ tarrasque plugin add --help
  `);
    process.exit(0);
  }

  foundCommand();
}
main();
