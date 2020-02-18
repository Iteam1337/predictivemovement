## Tests

- Learn how to assert on length etc
-

## Communication

- How to communicate between node and elixir?
- Can we get cars from elixir and get them as stream in node?

## Devops

- How to run Elixir, docker?


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
    - how do you mock things in tests? do you need to mock
    - do you do unit/integration/e2e tests?
    - can you use tests as a tool for development (like how we run test runners with watch in Node)

## Running it
  - how do you even run the code? (is it a running process? is it a web server?)
  - how do you scale? (do we need to think about it? for ex in Node one way to scale is using a queue and then having multiple listeners doing the same jobs)

## CI/CD
  - can you easily just build and deploy like we do for a Node app
    ex. for Node app:
      - Docker image
      - Travis CI/Github actions builds the image and deploy it in some kubernetes cluster
  - do you have to download extensions or are they compiled artifact?

## Experience
  - it's a new language for us (is this going to be a problem?)

---

# Elixir and/vs Highland

- how do we send data from elixir to node? (we use RabbitMQ)
- how to we handle the car position in Elixir since things are immutable and you can't update the position on a timer