import { $, argv, cd } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    console.info(`
    Description
      Upgrades application dependencies for client and server according to semver.

    Usage
      $ tarrasque upgrade
  `);
    process.exit(0);
  }

  console.info('📂 Upgrading root...');
  await $`yarn upgrade`;

  console.info('📂 Upgrading client...');
  cd('packages/client');
  await $`yarn upgrade`;

  console.info('📂 Upgrading server...');
  cd('../server');
  await $`yarn upgrade`;

  console.info('✅ Upgraded!');
}
main();
