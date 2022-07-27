import { $, argv, cd, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Checks the application for linting errors.

    Usage
      $ tarrasque lint
  `);
    process.exit(0);
  }

  echo(`📂 Linting root...`);
  await $`yarn lint`;

  echo(`📂 Linting client...`);
  cd('packages/client');
  await $`yarn lint`;

  echo(`📂 Linting server...`);
  cd('../server');
  await $`yarn lint`;

  echo(`✅ Linted!`);
}
main();
