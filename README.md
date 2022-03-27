# canary

## Setup

### Install Terry

Terry is the CLI helper for running Tarrasque.io Canary commands. You alias it on your local system by running:

```
alias terry=$PWD/bin/terry.sh
```

You can run `terry help` to see the list of available commands.

You can ensure that Terry is always available on your system by running:

```
echo alias terry=$PWD/bin/terry.sh >> ~/.bashrc
```

### Install dependencies

This will run `yarn` on each workspace.

```
terry install
```

## Run development server

To start the Docker development server, run:

```
terry dev
```

Once started, you will need to trust the certificate available at `./data/caddy/certificates/local/localhost/localhost.crt`. This is because the development server is running on [Caddy](https://caddyserver.com) which requires an SSL certificate.
