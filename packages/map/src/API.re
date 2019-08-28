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

  type properties = {color: array(int)};

  type route = {
    geometry,
    properties,
  };

  let makeRoute = (~geometry, ~properties) => {geometry, properties};

  type waypoint = {location: array(float)};

  type routeRoot = {
    routes: array(route),
    waypoints: array(waypoint),
  };

  type response = {
    id: string,
    maxTime: float,
    distance: float,
    duration: float,
    route: routeRoot,
    stops: array(Stops.t),
  };

  type routeWithId = {
    id: string,
    response,
  };

  let geometry = json => {
    coordinates:
      json |> field("coordinates", array(array(Json.Decode.float))),
    _type: json |> field("type", string),
  };

  let properties = json => {color: json |> field("color", array(int))};

  let route = json => {
    geometry:
      json
      |> withDefault(
           {coordinates: [||], _type: "LineString"},
           field("geometry", geometry),
         ),
    properties: {
      color: [|255, 0, 0, 255|],
    },
  };

  let waypoint = json => {
    location: json |> field("location", array(Json.Decode.float)),
  };

  let routeRoot = json => {
    routes: json |> field("routes", array(route)),
    waypoints:
      json |> withDefault([||], field("waypoints", array(waypoint))),
  };

  let routeFromJson = json => {
    id: json |> field("id", Json.Decode.string),
    distance: json |> field("distance", Json.Decode.float),
    maxTime: json |> field("maxTime", Json.Decode.float),
    duration: json |> field("duration", Json.Decode.float),
    route: json |> field("route", routeRoot),
    stops: json |> field("stops", array(Stops.fromJson)),
  };
  type routeDetails = {
    id: string,
    stops: array(Stops.t),
    geometry,
    waypoints: array(waypoint),
  };

  let routeDetailFromJson = json => {
    id: json |> field("id", Json.Decode.string),
    stops: json |> field("stops", array(Stops.fromJson)),
    geometry:
      json
      |> withDefault(
           {coordinates: [||], _type: "LineString"},
           field("geometry", geometry),
         ),
    waypoints:
      json |> withDefault([||], field("waypoints", array(waypoint))),
  };

  let routeDetailsFromJson = json => list(routeDetailFromJson, json);

  let routesFromJson = json => field("data", list(routeFromJson), json);
};

module Travel = {
  module Route = {
    let fromType =
      fun
      | `Person => "/pickup"
      | `PendingRoute(id) => "/pending-route/" ++ id
      | `Driver => "/route"
      | `RouteId(id) => "/route/" ++ id;

    let fromSocketType =
      fun
      | `Person => "passenger"
      | `Driver => "driver";

    let make = t => Config.apiHost ++ fromType(t);
  };

  module Socket = {
    let make = (~route, ~body) => {
      let payload =
        Js.Json.stringify(
          Json.Encode.(
            object_([
              ("type", string(Route.fromSocketType(route))),
              ("payload", body),
            ])
          ),
        );
      Socket.emit("event", payload);
    };

    module Events = {
      let acceptChange = id =>
        Socket.emit(
          "event",
          Js.Json.stringify(
            Json.Encode.(
              object_([
                ("type", string("acceptChange")),
                ("payload", object_([("id", string(id))])),
              ])
            ),
          ),
        );
    };
  };

  let optimisedRoutes = (~url="/demo/routes", ~callback, ()) =>
    Refetch.fetch(Config.apiHost ++ url)
    |> Repromise.andThen(Refetch.json)
    |> Repromise.map(Car.routesFromJson)
    |> Repromise.wait(callback);

  let route = (~url="/route/", ~callback, id) =>
    Refetch.fetch(Config.apiHost ++ url ++ id)
    |> Repromise.andThen(Refetch.json)
    |> Repromise.map(Car.routeFromJson)
    |> Repromise.wait(callback);

  let routeDetails = (~url="/demo/route/", ~callback, id) =>
    Refetch.fetch(Config.apiHost ++ url ++ id)
    |> Repromise.andThen(Refetch.json)
    |> Repromise.map(Car.routeDetailsFromJson)
    |> Repromise.wait(callback);

  let pendingRoute = (~callback, id) =>
    route(~url="/pending-route/", ~callback, id);

  let generateRoutes = (~callback) =>
    Refetch.fetch(Config.generateRoutesHost)
    |> Repromise.andThen(Refetch.json)
    |> Repromise.wait(callback);

  let decodeGeometry = d => {
    Js.log(d);
    d;
  };

  let pendingRoutes = (~url="/demo/pending/", ~callback, ()) =>
    Refetch.fetch(Config.apiHost ++ url)
    |> Repromise.andThen(Refetch.json)
    |> Repromise.map(Car.routesFromJson)
    /* |> Repromise.map(routes => { */
    /*      routes->Belt.List.map(r => { */
    /*        route( */
    /*          ~callback= */
    /*            d => { */
    /*              Js.log(d); */
    /*              d; */
    /*            }, */
    /*          ~url="/route/", */
    /*          r.id, */
    /*        ); */
    /*        r; */
    /*      }); */
    /*      routes; */
    /*    }) */
    |> Repromise.wait(callback);
};
