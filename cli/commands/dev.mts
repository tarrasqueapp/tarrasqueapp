import { spawn } from 'child_process';
import { argv, echo } from 'zx';

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Compiles the application for local development.

    Usage
      $ tarrasque dev <services>

    <services> represents the Docker Compose services for the application.
    If no services are provided, they will all be enabled.

    Options
      --detached, -d     Can be used to run the application in detached mode
  `);
    process.exit(0);
  }

  const services = process.argv.slice(3).join(' ');
  const command =
    `-f docker-compose.yaml -f docker-compose.dev.yaml --env-file ./.env up --build --remove-orphans ${services}`.trim();

  spawn('docker-compose', command.split(' '), { stdio: [0, 1, 2] });
}
main();
