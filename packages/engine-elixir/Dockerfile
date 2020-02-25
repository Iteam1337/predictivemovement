FROM elixir as build

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

COPY lib ./lib
COPY mix.exs .
COPY mix.lock .

#Install dependencies and build Release
RUN export MIX_ENV=prod && \
    rm -Rf _build && \
    mix deps.get && \
    mix release

FROM elixir

WORKDIR /app
COPY --from=build /app/_build/prod/rel/engine .

#Set default entrypoint and command
ENTRYPOINT ["/app/bin/engine"]
CMD ["start"]