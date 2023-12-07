<p align="center">
  <a href="https://tarrasque.app">
    <img src="public/images/logo.svg" width="150" />
  </a>

  <h1 align="center">Tarrasque App</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/version/tarrasqueapp/tarrasqueapp" />
  <img src="https://img.shields.io/github/actions/workflow/status/tarrasqueapp/tarrasqueapp/deploy-sandbox.yaml" />
  <img src="https://img.shields.io/github/license/tarrasqueapp/tarrasqueapp" />
</p>

Tarrasque App is a free and open-source virtual tabletop software for playing Dungeons & Dragons. It allows you to create and manage your own campaigns, maps, and characters, and provides a simple and intuitive interface for playing D&D online or in-person.

> **Note**
> Tarrasque App is the official open-source successor to [Tarrasque.io](https://tarrasque.io). You can read the announcement regarding the new version [here](https://announcekit.app/tarrasque.io/changelog/tarrasque.io-is-going-open-source-3IZhu).

> **Warning**
> This project is in pre-alpha and is not yet ready for public use. Please do not use this in production or with real data. We are not responsible for any data loss or other issues that may occur.

## Requirements

- [Node.js](https://nodejs.org/en/) (v18.12.1 or higher)
- [pnpm](https://pnpm.io/) (v8.8.0 or higher)

## Installation

To install Tarrasque App, first run the following command to install the [Tarrasque CLI](https://github.com/tarrasqueapp/cli):

    npm install -g @tarrasque/cli

Then, run the following commands to install the dependencies and set up the environment variables:

    ./bin/setup.sh
    cp .env.example .env

Finally, edit the `.env` file to set the necessary environment variables.

## Running the Server

To start the development server, run:

    tarrasque app dev

This will start the UI and the local database service at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING](CONTRIBUTING.md) file for more information. If you have any questions, feel free to reach out to us on [Discord](https://tarrasque.app/discord). We'd love to hear from you! 😊

## License

Tarrasque App is licensed under the GNU Affero General Public License. See the [LICENSE](LICENSE) file for more information.
