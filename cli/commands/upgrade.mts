import { $, argv, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Upgrades application dependencies for ui and api according to semver.

    Usage
      $ tarrasque upgrade
  `);
    process.exit(0);
  }

  echo(`📂 Upgrading root...`);
  await $`pnpm upgrade`;

  echo(`📂 Upgrading ui...`);
  await $`pnpm ui upgrade`;

  echo(`📂 Upgrading api...`);
  await $`pnpm api upgrade`;

  echo(`✅ Upgraded!`);
}
main();
