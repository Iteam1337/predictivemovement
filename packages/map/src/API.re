module Travel = {
  module Route = {
    let fromType =
      fun
      | `Person => "/pickup"
      | `Car => "/route";

    let make = t => Config.apiHost ++ fromType(t);
  };

  let make = (~route, ~body, ~method_=Fetch.Post, ()) =>
    Repromise.(
      Belt.Result.(
        Fetch.fetchWithInit(
          Route.make(route),
          Fetch.RequestInit.make(
            ~method_,
            ~body=Fetch.BodyInit.make(Js.Json.stringify(body)),
            ~headers=
              Fetch.HeadersInit.make({"Content-Type": "application/json"}),
            (),
          ),
        )
        |> Js.Promise.then_(Fetch.Response.json)
        |> Rejectable.fromJsPromise
        |> Rejectable.map(value => Ok(value))
        |> Rejectable.catch(error => Error(error)->resolved)
      )
    );
};

module Car = {
  open Json.Decode;

  module Stops = {
    type t = {
      lat: float,
      lon: float,
    };

    let make = (lat, lon) => {lat, lon};

    let fromJson = json => {
      lat: json |> field("lat", Json.Decode.float),
      lon: json |> field("lon", Json.Decode.float),
    };
  };

  type geometry = {
    coordinates: array(array(float)),
    _type: string,
  };

  type route = {geometry};

  type waypoint = {location: array(float)};

  type routeRoot = {
    routes: array(route),
    waypoints: array(waypoint),
  };

  type response = {
    route: routeRoot,
    stops: array(Stops.t),
  };

  let geometry = json => {
    coordinates:
      json |> field("coordinates", array(array(Json.Decode.float))),
    _type: json |> field("type", string),
  };

  let route = json => {geometry: json |> field("geometry", geometry)};

  let waypoint = json => {
    location: json |> field("location", array(Json.Decode.float)),
  };

  let routeRoot = json => {
    routes: json |> field("routes", array(route)),
    waypoints: json |> field("waypoints", array(waypoint)),
  };

  let fromJson = json => {
    route: json |> field("route", routeRoot),
    stops: json |> field("stops", array(Stops.fromJson)),
  };
};
