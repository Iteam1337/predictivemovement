module Travel = {
  module Route = {
    let fromType =
      fun
      | `Person => "/person"
      | `Car => "/car";

    let make = t => Config.apiHost ++ fromType(t);
  };

  let make = (~route, ~method_, ~body) =>
    Js.Promise.(
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
      |> then_(Fetch.Response.json)
    );
};

module Car = {
  open Json.Decode;

  type geometry = {coordinates: array(array(float))};

  type route = {geometry};

  type routeRoot = {routes: array(route)};

  type response = {route: routeRoot};

  let geometry = json => {
    coordinates:
      json |> field("coordinates", array(array(Json.Decode.float))),
  };

  let route = json => {geometry: json |> field("geometry", geometry)};

  let routeRoot = json => {routes: json |> field("routes", array(route))};

  let fromJson = json => {route: json |> field("route", routeRoot)};
};
