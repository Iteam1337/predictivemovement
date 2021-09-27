FROM elixir:1.12 as build

WORKDIR /app

RUN mix local.hex --force && \
  mix local.rebar --force

COPY config ./config
COPY mix.exs .
COPY mix.lock .

COPY ./apps/engine/lib ./apps/engine/lib
COPY ./apps/engine/mix_tasks ./apps/engine/mix_tasks
COPY ./apps/engine/mix.exs ./apps/engine/mix.exs
COPY ./apps/engine/mix.lock ./apps/engine/mix.lock

#Install dependencies and build Release
RUN export MIX_ENV=prod && \
  rm -Rf _build && \
  mix do deps.get, release

FROM elixir:1.12

WORKDIR /app
COPY --from=build /app/_build/prod/rel/engine_umbrella .


#Set default entrypoint and command
ENTRYPOINT ["/app/bin/engine_umbrella"]
CMD ["start"]
