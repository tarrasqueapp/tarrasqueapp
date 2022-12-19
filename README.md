# Tarrasque App

## Setup

Run the following commands to install the dependencies for Tarrasque App, as well the CLI helper for running Tarrasque App commands:

    ./bin/setup.sh

### Install dependencies

This will run `yarn` on each workspace.

    tarrasque install

### Set environment variables

There's a `.env.example` file in the root folder. Copy `.env.example` to `.env` and set the variables as needed.

## Usage

### Run development server

To start the Docker development server, run:

    tarrasque docker up

You can then access the development server at `http://localhost`.

### Run production server

To start the Docker production server, run:

    tarrasque docker up --prod

You can then access the production server at `http://localhost`.

## Database

### Create database

Push the Prisma schema state to the database.

    yarn server prisma db push

### Migrate database

Create migrations from your Prisma schema, apply them to the database, and generate artifacts.

    yarn server prisma migrate dev --name <migration-name>

### Browse database

Browse the database using the Prisma Studio.

    yarn server prisma studio
