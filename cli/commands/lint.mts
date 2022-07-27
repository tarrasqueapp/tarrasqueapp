import { $, argv, cd } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    console.info(`
    Description
      Checks the application for linting errors.

    Usage
      $ tarrasque lint
  `);
    process.exit(0);
  }

  console.info('📂 Linting root...');
  await $`yarn lint`;

  console.info('📂 Linting client...');
  cd('packages/client');
  await $`yarn lint`;

  console.info('📂 Linting server...');
  cd('../server');
  await $`yarn lint`;

  console.info('✅ Linted!');
}
main();
