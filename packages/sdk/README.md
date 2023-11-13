<h1 align="center">
  <a href="https://tarrasque.app" target="_blank"><img src="https://tarrasque.app/images/logo.svg" width="150" /></a>
  <p>@tarrasque/sdk</p>
</h1>

This package contains the core logic for the Tarrasque SDK. You can use this package to build your own custom plugins for Tarrasque App.

> **Warning**
> This project is in pre-alpha and is not yet ready for public use.

## Installation

```sh
yarn add @tarrasque/sdk
```

## Usage

### Listening for events

```ts
import { TarrasqueEvent, tarrasque } from '@tarrasque/sdk';

tarrasque.on(TarrasqueEvent.CREATED_CHARACTER, (payload) => {
  // Do something with the payload
});
```

### Sending events

```ts
import { TarrasqueEvent, tarrasque } from '@tarrasque/sdk';

tarrasque.emit(TarrasqueEvent.CREATE_CHARACTER, {
  name: 'My Character',
  ...
});
```

### Creating a plugin

```ts
import { TarrasquePlugin } from '@tarrasque/sdk';

export default new TarrasquePlugin({
  name: '@tarrasque/dnd5e-plugin',
  version: '1.0.0',
});
```
