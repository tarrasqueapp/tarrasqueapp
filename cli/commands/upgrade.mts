import { $, argv, cd, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Upgrades application dependencies for client and server according to semver.

    Usage
      $ tarrasque upgrade
  `);
    process.exit(0);
  }

  echo(`📂 Upgrading root...`);
  await $`yarn upgrade`;

  echo(`📂 Upgrading client...`);
  cd('packages/client');
  await $`yarn upgrade`;

  echo(`📂 Upgrading server...`);
  cd('../server');
  await $`yarn upgrade`;

  echo(`✅ Upgraded!`);
}
main();
