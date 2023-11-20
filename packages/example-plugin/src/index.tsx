import { People } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';

import { TarrasqueEvent, TarrasquePlugin, UserEntity, tarrasque } from '@tarrasque/sdk';

import packageJson from '../package.json';

const CustomIconButton = styled(IconButton)({
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
});

export default class ExamplePlugin extends TarrasquePlugin {
  name = '@tarrasque/example-plugin';
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

  renderDockElement() {
    return (
      <CustomIconButton
        onClick={() => {
          // Get the current user
          const user = tarrasque.get<UserEntity>(['user']);

          // Get the current map
          const map = tarrasque.current.map;

          console.log(tarrasque.current);

          // Emit the ping location event
          tarrasque.emit(TarrasqueEvent.PING_LOCATION, {
            coordinates: { x: 0, y: 0 },
            color: 'red',
            mapId: map?.id,
            userId: user?.id,
          });
        }}
      >
        <People fontSize="large" />
      </CustomIconButton>
    );
  }
}
