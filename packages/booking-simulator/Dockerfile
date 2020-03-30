FROM elixir as build

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

COPY lib ./lib
COPY config ./config
COPY mix.exs .
COPY mix.lock .

#Install dependencies and build Release
RUN export MIX_ENV=prod && \
    rm -Rf _build && \
    mix do deps.get, release

FROM elixir

WORKDIR /app
COPY --from=build /app/_build/prod/rel/booking_simulator .

#Set default entrypoint and command
ENTRYPOINT ["/app/bin/booking_simulator"]
CMD ["start"]