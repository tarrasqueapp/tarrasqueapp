# vtt

## Setup

### Install Terry

Terry is the CLI helper for running Tarrasque App commands. You can install it on your local system by running:

    ./bin/install-terry.sh

You can run `terry help` to see the list of available commands.

### Install dependencies

This will run `yarn` on each workspace.

    terry install

## Usage

### Run development server

To start the Docker development server, run:

    terry dev

Once started, you will need to trust the certificate available at `./data/caddy/certificates/local/localhost/localhost.crt`. This is because the development server is running on [Caddy](https://caddyserver.com) which requires an SSL certificate.
