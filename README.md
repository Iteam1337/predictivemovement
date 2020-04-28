# Predictive Movement

[![Build Status](https://travis-ci.com/Iteam1337/pm-mapbox-test.svg?branch=master)](https://travis-ci.com/Iteam1337/pm-mapbox-test)

This is the source code for the collaborative open source project Predictive Movement. 

## About
Predictive Movement aims to create a digital platform that will act as a collaborative hub for the transports of people and goods with the help of artificial intelligence (AI). In its first phase, the project will solve the societal challenge of parcel deliveries in rural areas. Further on, the project aims to deal with optimizing availability and accessibility in areas ranging from urban to rural.

Predictive Movement is a project financed by, among others, Sweden’s Innovation Agency (Vinnova) and the Swedish Transport Administration. The project includes one Swedish region, four municipalities, a university, authorities as well as key actors within digitization and traffic/logistics. An important driving force behind the project is to combat climate change and to reduce emissions caused by road transports.

## Get Started

The source code for the project is contained in this mono-repo. Within the [packages](packages) folder you will find all included packages. Here is a summary of the components:
  
 * [Engine](packages/engine-elixir) The main logic written in Elixir/Erlang
 * [Driver interface](packages/driver-interface) Bot in Telegram for communicating with drivers
 * [Booking interface](packages/booking-interface) Bot in Telegram for communicating with bookers of transport
 * [Engine UI](packages/engine-ui) Main UI for visualising current bookings and cars
 * [Booking Simulator](packages/booking-simulator) Simulates a new booking every X seconds 
 * [Car Simulator](packages/car-simulator) Simulates cars driving on map
  
To deploy the relevant packages to your Kubernetes cluster, use Skaffold:

    skaffold run --tail
    
To debug run:

    skaffold dev
    
Or start RabbitMQ locally and the packages manually:

    docker-compose -f docker-compose.dev.yml up
    
    cd packages/engine-elixir/
    mix start
    # etc..


**Design mockup:** [Figma](https://www.figma.com/file/DdBjpoKd0T9OkWmhlpd48Nfa/Predictive-Movement)
