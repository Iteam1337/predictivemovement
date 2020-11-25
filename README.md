# Predictive Movement

[![Build Status](https://github.com/iteam1337/predictivemovement/workflows/Build%20&%20Deploy%20to%20Dev/badge.svg)](https://github.com/iteam1337/predictivemovement/actions)

This is the source code for the collaborative open source project Predictive Movement.

## About

Predictive Movement aims to create a digital platform that will act as a collaborative hub for the transports of people and goods with the help of artificial intelligence (AI). In its first phase, the project will solve the societal challenge of parcel deliveries in rural areas. Further on, the project aims to deal with optimizing availability and accessibility in areas ranging from urban to rural.

Predictive Movement is a project financed by, among others, Sweden’s Innovation Agency (Vinnova) and the Swedish Transport Administration. The project includes one Swedish region, four municipalities, a university, authorities as well as key actors within digitization and traffic/logistics. An important driving force behind the project is to combat climate change and to reduce emissions caused by road transports.

## Get Started

The source code for the project is contained in this mono-repo. Within the [packages](packages) folder you will find all included packages. Here is a summary of the components:

- [Engine](packages/elixir_umbrella/elixir_apps/engine) The main logic written in Elixir
- [Driver interface](packages/driver-interface) Bot in Telegram for communicating with drivers
- [Booking interface](packages/booking-interface) Bot in Telegram for communicating with bookers of transport
- [Engine UI](packages/engine-ui) Main UI for visualising current bookings and cars
- [Engine Server](packages/engine-server) Node-server backend for Engine UI
- [Route Optimization Jsprit](packages/route-optimization-jsprit) A fork of [Jsprit](https://github.com/graphhopper/jsprit); used to help calculating the best vehicle to booking matches.
- [Vehicle Offer](packages/vehicle-offer) Re-routes vehicle offers to the queue
- [Auto Accept Offer](packages/auto-accept-offer) Auto accepts offers for vehicles created in the Engine UI
- [Booking-dispatcher](packages/booking-dispatcher) Auto accepts offers for vehicles created in the Engine UI

To deploy the relevant packages to your Kubernetes cluster, use Skaffold:

    skaffold run --tail

To debug run:

    skaffold dev

### Running Predictive Movement locally

Set build variables

    export REACT_APP_MAPBOX_ACCESS_TOKEN=<FROM LASTPASS>

Start dependencies

    docker-compose up -d

run event_store migrations and start the engine

    cd packages/engine_umbrella/
    mix deps.get
    iex -S mix dev

**Design mockup:** [Figma](https://www.figma.com/file/DdBjpoKd0T9OkWmhlpd48Nfa/Predictive-Movement)

## Release

You will need:

- [docker installed](https://docs.docker.com/engine/install/)
- [kubectl installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [skaffold installed](https://skaffold.dev/docs/install/)
- [kustomize installed](https://kubernetes-sigs.github.io/kustomize/installation/)
- login with your Docker account
- access to Iteam Kubernetes cluster
- mapbox access token from `Predictivemovement` LastPass folder

Set environment variables that are used by Docker at build time (for the UI) and run the skaffold command with a profile:

```sh
export REACT_APP_MAPBOX_ACCESS_TOKEN=<FROM LASTPASS>
export REACT_APP_ENGINE_SERVER=https://engine-server.iteamdev.io
skaffold run --profile prod
```
