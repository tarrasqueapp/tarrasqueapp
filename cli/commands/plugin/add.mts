import crypto from 'crypto';
import { $, argv, cd, echo, fs, path } from 'zx';

import { appPath, pluginsPath } from '../../helpers.mjs';

async function main() {
  const source = argv._[2];

  if (!source || argv.help || argv.h) {
    echo(`
    Description
      Adds a new Tarrasque plugin.

    Usage
      $ tarrasque plugin add <url>

    <url> represents a local folder or the GitHub repository URL of the plugin.
  `);
    process.exit(0);
  }

  const temporaryPluginPath = crypto.randomUUID();
  cd(pluginsPath);

  const gitRepositoryRegex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)?(\/?|\#[-\d\w._]+?)$/;
  if (gitRepositoryRegex.test(source)) {
    // Clone the plugin from Git repository
    echo(`📂 Cloning git repository...`);
    await $`git clone ${source} ${temporaryPluginPath}`;
  } else if (fs.existsSync(path.resolve(appPath, source))) {
    // Copy the plugin from the local directory
    echo(`📂 Copying local directory...`);
    await fs.copy(path.resolve(appPath, source), temporaryPluginPath);
  } else {
    echo(`🚨 Invalid plugin source: ${source}`);
    process.exit(1);
  }

  // Read YAML file
  const pluginFile = await fs.readFile(`${temporaryPluginPath}/tarrasque.json`);
  const plugin = JSON.parse(pluginFile.toString());

  // Check that the plugin doesn't already exist
  if (await fs.pathExists(`${pluginsPath}/${plugin.id}`)) {
    echo(`🚨 Plugin already installed: ${plugin.id}`);
    await $`rm -rf ${temporaryPluginPath}`;
    process.exit(1);
  }

  // Rename the plugin directory to the plugin's ID
  echo(`📂 Installing plugin ${plugin.id}...`);
  await fs.rename(temporaryPluginPath, `${pluginsPath}/${plugin.id}`);

  // Install dependencies
  cd(`${pluginsPath}/${plugin.id}`);
  await $`yarn`;

  echo(`✅ Installed!`);
}
main();
