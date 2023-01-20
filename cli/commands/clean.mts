import { $, argv, cd, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Deletes installed dependencies and build files.

    Usage
      $ tarrasque clean

    Options
      --all, -a     Can be used to prune all database-related and uploaded files
  `);
    process.exit(0);
  }

  echo(`📂 Cleaning root...`);
  await $`rm -rf yarn-error.log node_modules`;

  echo(`📂 Cleaning ui...`);
  cd('apps/ui');
  await $`rm -rf .next`;

  echo(`📂 Cleaning api...`);
  cd('../api');
  await $`rm -rf dist`;

  if (argv.all || argv.a) {
    cd('../../data');
    echo(`📂 Cleaning database...`);
    await $`rm -rf postgres`;

    echo(`📂 Cleaning temporary files...`);
    await $`rm -rf tmp`;

    echo(`📂 Cleaning uploaded files...`);
    await $`find uploads \! -name '.gitkeep' -delete`;
  }

  echo(`✅ Cleaned!`);
}
main();
