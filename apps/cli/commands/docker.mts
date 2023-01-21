import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import { YAML, argv, echo, fs } from 'zx';

dotenv.config();

async function main() {
  // Show help if the help flag is set
  if (argv.help || argv.h) {
    echo(`
    Description
      Spawns a Docker Compose command using the appropriate configuration files.

    Usage
      $ tarrasque docker <cmd>

    <cmd> represents the Docker Compose command to run.

    Options
      --db          Can be used to run the local database service

    Examples
      $ tarrasque docker up
      $ tarrasque docker up ui nginx
      $ tarrasque docker up --db
  `);
    process.exit(0);
  }

  // Get the command to run
  let cmd = argv._[1];

  if (cmd.startsWith('up')) {
    // Get all services from the docker-compose.yaml file
    const dockerComposeYaml = await fs.readFile('./docker-compose.yaml');
    const composeJson = YAML.parse(dockerComposeYaml.toString());
    const allServices = Object.keys(composeJson.services);

    let services;
    // If services are provided, we want to run those instead
    if (cmd !== 'up') {
      services = cmd.split(' ').slice(1);
    } else {
      services = allServices;
    }

    // Remove database and tusd services from the list of services to run
    if (services.includes('postgres')) services.splice(services.indexOf('postgres'), 1);
    if (services.includes('tusd-local')) services.splice(services.indexOf('tusd-local'), 1);
    if (services.includes('tusd-s3')) services.splice(services.indexOf('tusd-s3'), 1);

    // Add the database service depending on the --db flag
    if (argv.db) {
      services.push('postgres');
    }

    // Set the storage provider to use for the api
    if (process.env.STORAGE_PROVIDER === 'local') {
      services.push('tusd-local');
    } else if (process.env.STORAGE_PROVIDER === 's3') {
      services.push('tusd-s3');
    } else {
      echo(`🚨 Invalid storage provider: ${process.env.STORAGE_PROVIDER}`);
      process.exit(1);
    }

    // Build the command to run
    cmd = `up --build --remove-orphans ${services.join(' ')} `;
  }

  const composeCommand = `--env-file ./.env ${cmd.trim()}`;

  spawn('docker-compose', composeCommand.split(' '), { stdio: [0, 1, 2] });
}
main();
