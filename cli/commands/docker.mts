import { spawn } from 'child_process';
import { YAML, argv, echo, fs } from 'zx';

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
      --prod, -p     Can be used to run the application in production mode
      --db           Can be used to run the local database service

    Examples
      $ tarrasque docker up
      $ tarrasque docker up client nginx
      $ tarrasque docker up --db
      $ tarrasque docker up --prod
      $ tarrasque docker up --prod --db client
  `);
    process.exit(0);
  }

  // Use the appropriate docker-compose file depending on the environment
  const composeFiles = ['docker-compose.yaml'];
  composeFiles.push(`docker-compose.${argv.prod || argv.p ? 'prod' : 'dev'}.yaml`);
  const composeFilesString = composeFiles.map((file) => `-f ${file}`).join(' ');

  // Get the command to run and remove the --prod and -p flags from the arguments
  let cmd = process.argv
    .slice(3)
    .filter((arg) => arg !== '--prod' && arg !== '-p' && arg !== '--db')
    .join(' ')
    .trim();

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

    // Add or remove the database service depending on the --db flag and the services provided
    if (argv.db && !services.includes('postgres')) {
      services.push('postgres');
    } else if (!argv.db && services.includes('postgres')) {
      services.splice(services.indexOf('postgres'), 1);
    }

    cmd = `up --build --remove-orphans ${services.join(' ')} `;
  }

  const composeCommand = `${composeFilesString} --env-file ./.env ${cmd.trim()}`;

  spawn('docker-compose', composeCommand.split(' '), { stdio: [0, 1, 2] });
}
main();
