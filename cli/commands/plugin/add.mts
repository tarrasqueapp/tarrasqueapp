import { $, argv, cd, fs, quiet } from 'zx';

import { pluginsPath } from '../../helpers.mjs';

async function main() {
  const repository = argv._[2];

  if (!repository || argv.help || argv.h) {
    console.info(`
    Description
      Adds a new Tarrasque plugin.

    Usage
      $ tarrasque plugin add <url>

    <url> represents the GitHub repository URL of the plugin.
    Must end with ".git".
  `);
    process.exit(0);
  }

  const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
  if (!regex.test(repository)) {
    console.error(`🚨 Invalid repository: ${repository}`);
    process.exit(1);
  }

  const basename = await quiet($`basename ${repository}`);
  const repositoryName = basename.stdout.replace(/\n$/, '').replace('.git', '');

  if (fs.existsSync(`${pluginsPath}/${repositoryName}`)) {
    console.error(`🚨 Plugin already installed: ${repositoryName}`);
    process.exit(1);
  }

  cd(pluginsPath);
  await $`git clone ${repository}`;
  cd(repositoryName);
  await $`yarn`;

  console.info('✅ Installed!');
}
main();
