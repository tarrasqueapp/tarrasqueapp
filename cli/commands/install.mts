import { $, argv, cd, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Installs application dependencies for client and server.

    Usage
      $ tarrasque install
  `);
    process.exit(0);
  }

  echo(`📂 Installing root...`);
  await $`yarn`;

  echo(`📂 Installing client...`);
  cd('packages/client');
  await $`yarn`;

  echo(`📂 Installing server...`);
  cd('../server');
  await $`yarn`;

  echo(`✅ Installed!`);
}
main();
