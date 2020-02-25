# FROM elixir as build
# COPY . .
# # RUN rm -Rf _build && mix local.hex --force && mix local.rebar && mix deps.get && mix release 
# RUN export MIX_ENV=prod && \
#     rm -Rf _build && \
#     mix deps.get && \
#     mix release




# FROM erlang 
# COPY --from=build /_build/ .
# CMD _build/dev/rel/engine/bin/engine start


#===========
#Build Stage
#===========
FROM elixir:1.10-alpine as build
WORKDIR /app
#Copy the source folder into the Docker image
COPY . /app


#Install dependencies and build Release
RUN export MIX_ENV=prod && \
    rm -Rf _build && \
    mix local.hex --force && \    
    mix deps.get && \
    mix release

#Extract Release archive to /rel for copying in next stage
RUN APP_NAME="engine" && \
    RELEASE_DIR=`ls -d /app/_build/prod/rel/$APP_NAME/releases/*/` && \
    mkdir /export && \
    tar -xf "$RELEASE_DIR/$APP_NAME.tar.gz" -C /export

#================
#Deployment Stage
#================
FROM pentacent/alpine-erlang-base:latest

#Set environment variables and expose port
EXPOSE 4000
ENV REPLACE_OS_VARS=true \
    PORT=4000

#Copy and extract .tar.gz Release file from the previous stage
COPY --from=build /export/ .

#Change user
USER default

#Set default entrypoint and command
ENTRYPOINT ["/opt/app/bin/engine"]
CMD ["foreground"]