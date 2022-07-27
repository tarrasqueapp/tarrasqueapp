import { $, argv, cd } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    console.info(`
    Description
      Installs application dependencies for client and server.

    Usage
      $ tarrasque install
  `);
    process.exit(0);
  }

  console.info('📂 Installing root...');
  await $`yarn`;

  console.info('📂 Installing client...');
  cd('packages/client');
  await $`yarn`;

  console.info('📂 Installing server...');
  cd('../server');
  await $`yarn`;

  console.info('✅ Installed!');
}
main();
