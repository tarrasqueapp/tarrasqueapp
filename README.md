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

- [Node.js](https://nodejs.org/en/) (v20.11.1 or higher)
- [pnpm](https://pnpm.io/) (v8.11.0 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started?platform=macos) (v1.123.4 or higher)

## Installation

### Install dependencies

Tarrasque App uses [pnpm](https://pnpm.io/) as its package manager. To install the dependencies, run:

    pnpm install

### Set up database

Tarrasque App uses [Supabase](https://supabase.com/) as its database. You can either use a free cloud-hosted Supabase project or run a local instance of Supabase using Docker by running:

    supabase start

If you're using a cloud-hosted Supabase project, be aware that you will not be able to use Tarrasque App without an internet connection.

### Set environment variables

Copy the `.env.example` file to `.env` and edit it to set the necessary environment variables as per your Supabase project settings.

    cp .env.example .env

If you're using a cloud-hosted Supabase project, you can find the values for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in your Supabase project settings under the "API" tab. For a local Supabase instance, the values will be displayed in the terminal when you run `supabase start`.

## Running the Production Server

Similarly, to start the production server, run:

    pnpm build
    pnpm start

This will start the UI at `http://localhost:3000`.

## Development

### Running the Development Server

To start the development server, run:

    pnpm dev

This will start the UI at `http://localhost:3000`.

### Creating a database migration

You can create a new database migration by running:

    supabase migration new <migration-name>

This will create a new empty migration file in the `migrations` directory. You can then edit this file to add the necessary SQL commands to migrate the database schema. Alternatively, you can make changes to the database schema using the Supabase web interface and then generate the migration file by running:

    supabase db diff <--local|--linked> --file <migration-name>

### Generating schema types from Supabase

After making changes to the Supabase database schema, you can generate the TypeScript types for the schema by running:

    supabase gen types typescript <--local|--linked> > utils/supabase/types.gen.ts

### Resetting the database

You can reset the database to its initial state by running:

    supabase db reset

This will delete all data in the database and run all the migrations from the beginning.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING](CONTRIBUTING.md) file for more information. If you have any questions, feel free to reach out to us on [Discord](https://tarrasque.app/discord). We'd love to hear from you! 😊

## License

Tarrasque App is licensed under the GNU Affero General Public License. See the [LICENSE](LICENSE) file for more information.
