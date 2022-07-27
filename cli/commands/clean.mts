import { $, argv, cd } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    console.info(`
    Description
      Deletes installed dependencies and build files.

    Usage
      $ tarrasque clean
  `);
    process.exit(0);
  }

  console.info('📂 Cleaning root...');
  await $`rm -rf yarn-error.log`;

  console.info('📂 Cleaning client...');
  cd('packages/client');
  await $`rm -rf yarn-error.log node_modules .next dist`;

  console.info('📂 Cleaning server...');
  cd('../server');
  await $`rm -rf yarn-error.log node_modules dist`;

  console.info('✅ Cleaned!');
}
main();
