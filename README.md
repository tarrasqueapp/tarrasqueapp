# Tarrasque App

## Setup

Run the following commands to install Tarrasque App on your local machine:

    ./bin/setup.sh

This will install the dependencies for Tarrasque App, as well as Terry, the CLI helper for running Tarrasque App commands.

### Install dependencies

This will run `yarn` on each workspace.

    terry install

### Set environment variables

There's a `.env.example` file in the root folder. Copy `.env.example` to `.env` and set the variables as needed.

## Usage

### Run development server

To start the Docker development server, run:

    terry dev

You can then access the development server at `http://localhost:3000`.

### Run production server

To start the Docker production server, run:

    terry prod

You can then access the production server at `http://localhost:3000`.
