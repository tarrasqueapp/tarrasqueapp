import { $, argv, cd, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Deletes installed dependencies and build files.

    Usage
      $ tarrasque clean
  `);
    process.exit(0);
  }

  echo(`📂 Cleaning root...`);
  await $`rm -rf yarn-error.log`;

  echo(`📂 Cleaning client...`);
  cd('packages/client');
  await $`rm -rf yarn-error.log node_modules .next dist`;

  echo(`📂 Cleaning server...`);
  cd('../server');
  await $`rm -rf yarn-error.log node_modules dist`;

  echo(`✅ Cleaned!`);
}
main();
