FROM elixir as build

WORKDIR /app

RUN mix local.hex --force && \
  mix local.rebar --force

COPY config ./config
COPY mix.exs .
COPY mix.lock .

COPY ./elixir_apps/engine/lib ./elixir_apps/engine/lib
COPY ./elixir_apps/engine/mix.exs ./elixir_apps/engine/mix.exs
COPY ./elixir_apps/engine/mix.lock ./elixir_apps/engine/mix.lock

#Install dependencies and build Release
RUN export MIX_ENV=prod && \
  rm -Rf _build && \
  mix do deps.get, release

FROM elixir

WORKDIR /app
COPY --from=build /app/_build/prod/rel/elixir_umbrella .


#Set default entrypoint and command
ENTRYPOINT ["/app/bin/elixir_umbrella"]
CMD ["start"]