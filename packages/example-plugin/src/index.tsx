import { TarrasqueEvent, TarrasquePlugin, tarrasque } from '@tarrasque/sdk';

import packageJson from '../package.json';

export default class ExamplePlugin extends TarrasquePlugin {
  name = '@tarrasque/example-plugin';
  version = packageJson.version;
  title = 'Example Plugin';
  description = 'An example plugin for Tarrasque';
  author = 'Tarrasque App';

  constructor() {
    super();

    console.log('constructor');

    tarrasque.on(TarrasqueEvent.PINGED_LOCATION, (mapId) => {
      console.log('Location pinged!', mapId);
    });
  }

  renderDock() {
    return (
      <button
        onClick={() => {
          tarrasque.emit(TarrasqueEvent.PING_LOCATION, 'clp1kob2u000208l6d1v2q2j6');
        }}
      >
        Example Plugin
      </button>
    );
  }
}
