## Tests

- Learn how to assert on length etc
-

## Communication

- How to communicate between node and elixir?
  a: RabbitMQ seems to work fine

- Can we get cars from elixir and get them as stream in node?
  a: yes through fluent-amqp

## Devops

- How to run Elixir, docker?
  a: yes. and we can run it without if we'd rather run it as a process and connect the nodes together through the cli.

---

# Elixir vs Node

## Docs
  - there seem to be really good and consisent documentation (official and 3rd party libraries)

## Extensions
  - it seems you have to install 3rd party libraries for basic things you want to do (json handling, making http requests, math functions)
  - it also seems you don't have to install a huge bunch of libraries for things like stream handling, functional programming

## Tests

  #### how do you run tests
    - what test runner
    a: mix test

    - how do you mock things in tests? do you need to mock
    a: since everything is immutable I don't think we need to mock much

    - do you do unit/integration/e2e tests?
    a: let's talk to mikael

    - can you use tests as a tool for development (like how we run test runners with watch in Node)
    a: yes. mix test.watch

## Running it
  - how do you even run the code? (is it a running process? is it a web server?)
  a: it is a running a single threaded process exactly like node. it can be a web server with Phoenix (similar to express).

  - how do you scale? (do we need to think about it? for ex in Node one way to scale is using a queue and then having multiple listeners doing the same jobs)
  a: elixir is made for scaling. https://blog.discordapp.com/scaling-elixir-f9b8e1e7c29b - scroll down to https://www.poeticoding.com/running-elixir-in-docker-containers/#running-multiple-containers to see nodes connected between docker nodes.

## CI/CD
  - can you easily just build and deploy like we do for a Node app
    ex. for Node app:
      - Docker image
      a: yes. There is an official docker image FROM elixir:latest. Also there is a mix package called mix-docker which creates and handles the build and publish process if we want to. 

      - Travis CI/Github actions builds the image and deploy it in some kubernetes cluster
      a: we should explore this more. 

  - do you have to download extensions or are they compiled artifact?
  a: all dependencies are compiled and placed under _build dir when you run `mix release` - the end result is a cli  which has these options available from start:

  ```
  _build/dev/rel/hellowordl/bin/hellowordl
Usage: hellowordl COMMAND [ARGS]

The known commands are:

    start          Starts the system
    start_iex      Starts the system with IEx attached
    daemon         Starts the system as a daemon
    daemon_iex     Starts the system as a daemon with IEx attached
    eval "EXPR"    Executes the given expression on a new, non-booted system
    rpc "EXPR"     Executes the given expression remotely on the running system
    remote         Connects to the running system via a remote shell
    restart        Restarts the running system via a remote command
    stop           Stops the running system via a remote command
    pid            Prints the operating system PID of the running system via a remote command
    version        Prints the release name and version to be booted
  ```

## Experience
  - it's a new language for us (is this going to be a problem?)
  a: yes. this is the main argument against and we all need to spend some time to learn it. That means we all need to feel that we are curious about it.

---

## Elixir and/vs Highland

- how do we send data from elixir to node? (we use RabbitMQ)
  a: we can use sockets or graphql or other traditional ways to communicate as well.

- how to we handle the car position in Elixir since things are immutable and you can't update the position on a timer
  a: instead of pushing positions we should pull the positions whenever someone connects. this is how lazy streams work anyway so it makes more sence to do it that way.