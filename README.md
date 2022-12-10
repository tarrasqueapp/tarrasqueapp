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

# Kubernetes

Create a secret for the registry:

    doctl registry kubernetes-manifest | kubectl apply -f -

Create a secret for Cloudflare:

    kubectl create secret generic cloudflare-api-token-secret --from-literal="api-token=<CLOUDFLARE_API_TOKEN>" -n cert-manager

Delete deployments

    helm delete cert-manager -n cert-manager
    helm delete ingress-nginx -n ingress-nginx
    helm delete client -n client

    kubectl delete namespace cert-manager
    kubectl delete namespace ingress-nginx
    kubectl delete namespace client

Install helm charts:

    helm upgrade -i cert-manager ./helm/cert-manager -n cert-manager --create-namespace
    helm upgrade -i ingress-nginx ./helm/ingress-nginx -n ingress-nginx --create-namespace
    helm upgrade -i client ./helm/client -n client --create-namespace

# PWA Assets

PWA assets are generated from the `packages/client/public/images/logo.svg` file and are used for the PWA manifest, splash screen, and icons.

Run the following command to generate the PWA assets:

    ./bin/generate-pwa-assets.sh
