import { spawn } from 'child_process';
import { argv, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Compiles the application for production development.

    Usage
      $ tarrasque prod <services>

    <services> represents the Docker Compose services for the application.
    If no services are provided, they will all be enabled.

    Options
      --detached, -d     Can be used to run the application in detached mode
  `);
    process.exit(0);
  }

  const services = process.argv.slice(4).join(' ');
  const command =
    `-f docker-compose.yml -f docker-compose.prod.yml --env-file ./.env up --build --remove-orphans ${services}`.trim();

  spawn('docker-compose', command.split(' '), { stdio: [0, 1, 2] });
}
main();
