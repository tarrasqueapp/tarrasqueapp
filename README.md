# vtt

## Setup

### Install Terry

Terry is the CLI helper for running Tarrasque App commands. You can install it on your local system by running:

    ./bin/install-terry.sh

You can run `terry help` to see the list of available commands.

### Install dependencies

This will run `yarn` on each workspace.

    terry install

### Set environment variables

There's a `.env.example` file in the root folder and each of the `apps` subfolders. Copy each `.env.example` to `.env` and set the variables as needed.

## Usage

### Run development server

To start the Docker development server, run:

    terry dev

The development server is running on [Caddy](https://caddyserver.com) which requires an SSL certificate. Caddy will automatically generate a self-signed certificate for you, but you may need to add and trust the certificate available at `./data/caddy/certificates/local/localhost/localhost.crt`.

### Run production server

To start the Docker production server, run:

    terry prod

The production server is running on [Caddy](https://caddyserver.com) which requires an SSL certificate. Currently, Caddy is configured to use Cloudflare's SSL certificate generator in production. You can create a Cloudflare API token for use with `apps/caddy` at https://dash.cloudflare.com/profile/api-tokens and add it to the `CLOUDFLARE_API_TOKEN` environment variable before running `terry prod`.
