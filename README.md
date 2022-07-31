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

    tarrasque dev

You can then access the development server at `http://localhost`.

### Run production server

To start the Docker production server, run:

    tarrasque prod

You can then access the production server at `http://localhost`.

## Database

### Create database

Push the state from Prisma schema to the database during prototyping.

    yarn server prisma db push

Seed the database with sample data.

    yarn server prisma db seed

# Kubernetes

Create a secret for the registry:

    doctl registry kubernetes-manifest | kubectl apply -f -

Create a secret for Cloudflare:

    kubectl create secret generic cloudflare-api-token-secret --from-literal="api-token=<CLOUDFLARE_API_TOKEN>" -n cert-manager

Delete deployments

    helm delete cert-manager -n cert-manager
    helm delete ingress-nginx -n ingress-nginx
    helm delete demo -n demo

    kubectl delete namespace cert-manager
    kubectl delete namespace ingress-nginx
    kubectl delete namespace demo

Install helm charts:

    helm upgrade -i cert-manager ./helm/cert-manager -n cert-manager --create-namespace
    helm upgrade -i ingress-nginx ./helm/ingress-nginx -n ingress-nginx --create-namespace
    helm upgrade -i demo ./helm/demo -n demo --create-namespace
