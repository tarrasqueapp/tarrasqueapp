import { People } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { TarrasqueEvent, TarrasquePlugin, tarrasque } from '@tarrasque/sdk';

import packageJson from '../package.json';

export default class ExamplePlugin extends TarrasquePlugin {
  name = packageJson.name;
  version = packageJson.version;
  title = 'Example Plugin';
  description = 'An example plugin for Tarrasque';
  author = 'Tarrasque App';

  constructor() {
    super();

    tarrasque.on(TarrasqueEvent.PINGED_LOCATION, (data) => {
      console.log('Location pinged!', data);
    });
  }

  /**
   * Render the dock element for the plugin
   * @returns The dock element
   */
  renderDockElement() {
    return (
      <IconButton
        sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}
        onClick={() => {
          // Emit the ping location event
          tarrasque.emit(TarrasqueEvent.PING_LOCATION, {
            coordinates: { x: 0, y: 0 },
            color: 'red',
            mapId: tarrasque.data.map.id,
            userId: tarrasque.data.user.id,
          });
        }}
      >
        <People fontSize="large" />
      </IconButton>
    );
  }
}
