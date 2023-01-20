import { $, argv, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Installs application dependencies for ui and api.

    Usage
      $ tarrasque install
  `);
    process.exit(0);
  }

  echo(`📂 Installing root...`);
  await $`pnpm install`;

  echo(`📂 Installing ui...`);
  await $`pnpm ui install`;

  echo(`📂 Installing api...`);
  await $`pnpm api install`;

  echo(`✅ Installed!`);
}
main();
