import { $, argv, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Prunes Docker containers, and optionally volumes and images.

    Usage
      $ tarrasque prune

    Options
      --all, -a     Can be used to prune all Docker-related files
  `);
    process.exit(0);
  }

  echo(`📂 Pruning docker containers...`);
  await $`docker container prune -f`;

  if (argv.all || argv.a) {
    echo(`📂 Pruning docker volumes...`);
    await $`docker volume prune -f`;

    echo(`📂 Pruning docker system...`);
    await $`docker system prune -a -f`;
  }

  echo(`✅ Pruned!`);
}
main();
