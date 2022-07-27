import { fileURLToPath } from 'url';
import { path } from 'zx';

const __filename = fileURLToPath(import.meta.url);

export const appPath = path.resolve(path.dirname(__filename), '..');
export const commandsPath = path.resolve(appPath, 'cli', 'commands');
export const pluginsPath = path.resolve(appPath, 'plugins');
