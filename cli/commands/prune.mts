import { $, argv } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    console.info(`
    Description
      Prunes Docker containers, and optionally volumes and images.

    Usage
      $ tarrasque prune

    Options
      --all, -a     Can be used to prune all Docker-related files
  `);
    process.exit(0);
  }

  console.info('📂 Pruning docker containers...');
  await $`docker container prune -f`;

  if (argv.all || argv.a) {
    console.info('📂 Pruning docker volumes...');
    await $`docker volume prune -f`;

    console.info('📂 Pruning docker system...');
    await $`docker system prune -a -f`;
  }

  console.info('✅ Pruned!');
}
main();
