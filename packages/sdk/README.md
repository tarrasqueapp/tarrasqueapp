<p align="center">
  <a href="https://tarrasque.app">
    <img src="https://tarrasque.app/images/logo.svg" width="150" />
  </a>

  <h1 align="center">Tarrasque SDK</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/%40tarrasque%2Fsdk" />
  <img src="https://img.shields.io/github/actions/workflow/status/tarrasqueapp/sdk/release.yaml" />
  <img src="https://img.shields.io/github/license/tarrasqueapp/tarrasqueapp" />
</p>

This package contains the core logic for the Tarrasque Software Development Kit. You can use this package to build your own custom plugins for Tarrasque App.

> **Warning**
> This project is in pre-alpha and is not yet ready for public use.

## Requirements

- [Node.js](https://nodejs.org/en/) (v18.12.1 or higher)

## Installation

```sh
npm install @tarrasque/sdk
```

## Developing a Plugin

Tarrasque SDK allows you to create custom plugins for Tarrasque App. These plugins can be used to add new features to the app, such as custom character sheets or map tools, improve existing features, or even add new game systems.

Plugins are loaded into the app using an iframe. This allows you to use any technologies you want to build your plugin, including React, Vue, or good ol' HTML and JavaScript.

All plugins must be hosted on a public website, such as [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com), or [Netlify](https://netlify.com). Once your plugin is ready, you can submit it to the [Plugins Repository](https://github.com/tarrasqueapp/plugins) to make it available to all Tarrasque users.

Plugins must include a `manifest.json` file, which contains information about the plugin, such as its name, description, and URLs. This file must be located at the root of the plugin's public directory.

Here's an example of a `manifest.json` file, based on the [Dungeons & Dragons 5th Edition plugin](https://github.com/tarrasqueapp/dnd5e):

```json
{
  // A unique identifier for the plugin (usually in the format `username/repo`)
  "id": "tarrasqueapp/dnd5e",
  // The title of the plugin
  "name": "Dungeons & Dragons 5th Edition",
  // A short description of the plugin
  "description": "A plugin for the Dungeons & Dragons 5th Edition ruleset",
  // The name of the plugin's author
  "author": "Tarrasque App",
  // An array of URLs where the plugin's files can be accessed
  "urls": [
    // The image file that will be used as the plugin's icon (at least 32x32 pixels)
    {
      "name": "icon",
      "url": "https://dnd5e.tarrasque.app/icon.svg"
    },
    // The URL that will be used to load the plugin in the map overlay
    // Optional, only needed if the plugin displays a map overlay (e.g. dice roller, character sheet, etc.)
    {
      "name": "map_iframe",
      "url": "https://dnd5e.tarrasque.app/overlay",
      // The width and height of the iframe where the plugin will be shown
      "width": 300,
      "height": 300
    },
    // The URL that will be used to load the plugin in the compendium
    // Optional, only needed if the plugin has compendium data (e.g. spells, monsters, abilities, etc.)
    {
      "name": "compendium_iframe",
      "url": "https://dnd5e.tarrasque.app/compendium"
    },
    // The URL of the plugin's repository or documentation for more information (optional)
    {
      "name": "homepage",
      "url": "https://github.com/tarrasqueapp/dnd5e"
    }
  ]
}
```

For an example of another custom plugin, see the [examples folder](https://github.com/tarrasqueapp/sdk/tree/main/examples).

## Usage

A full list of events used, emitted, and listened to by Tarrasque App can be found in the [main repository](https://github.com/tarrasqueapp/tarrasqueapp).

### Listening for Events

The SDK allows listening to various events, such as campaign changes and map interactions:

```ts
import { Tarrasque } from '@tarrasque/sdk';

const tarrasque = new Tarrasque();
tarrasque.on('viewport-changed', (data) => {
  // Handle viewport update
});
```

### Fetching Data

You can fetch data from the Tarrasque API using the `get` method:

```ts
import { Tarrasque } from '@tarrasque/sdk';

const tarrasque = new Tarrasque();
const coordinates = await tarrasque.get('viewport-coordinates');
```

### Listening For Events

You can listen for events to perform actions like updating the UI or fetching data:

```ts
import { Tarrasque } from '@tarrasque/sdk';

const tarrasque = new Tarrasque();
tarrasque.on('viewport-changed', (data) => {
  // Handle viewport update
});
```

### Emitting Events

You can also emit events to perform actions like creating characters, moving the viewport, or updating the map:

```ts
import { Tarrasque } from '@tarrasque/sdk';

const tarrasque = new Tarrasque();
tarrasque.emit('viewport-set-coordinates', { x: 0, y: 0 });
```

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING](https://github.com/tarrasqueapp/.github/tree/main/CONTRIBUTING.md) file for more information. If you have any questions, feel free to reach out to us on [Discord](https://tarrasque.app/discord). We'd love to hear from you! 😊

## License

Tarrasque App is licensed under the GNU Affero General Public License. See the [LICENSE](LICENSE) file for more information.
