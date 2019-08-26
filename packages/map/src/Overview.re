open ReactMap;

type state = {
  initialRoutes: option(list(API.Car.response)),
  optimisedRoutes: option(list(API.Car.response)),
  tooltip: ReactMap.IconLayer.hoverInfo,
  viewState: ReactMap.DeckGL.viewState,
};

type action =
  | Tooltip(ReactMap.IconLayer.hoverInfo)
  | ViewState(ReactMap.DeckGL.viewState);

let initialState: state = {
  initialRoutes: None,
  optimisedRoutes: None,
  tooltip: {
    x: 0,
    y: 0,
    _object: None,
  },
  viewState:
    DeckGL.viewState(~longitude=18.482718, ~latitude=66.10176, ~zoom=7, ()),
};

[@react.component]
let make = () => {
  let notifications = React.useContext(Notifications.Context.t);

  let ({viewState, tooltip, initialRoutes}, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | Tooltip(tooltip) => {...state, tooltip}
        | ViewState(viewState) => {...state, viewState}
        },
      initialState,
    );

  let flyToRoute = (waypoints: array(API.Car.waypoint)) => {
    let viewport =
      Belt.Array.(
        switch (waypoints->get(0), waypoints->get(length(waypoints) - 1)) {
        | (Some(f), Some(l)) => [|f.location, l.location|]
        | (_, _) => [||]
        }
      )
      |> Viewport.make;

    dispatch(
      ViewState(
        DeckGL.viewState(
          ~longitude=viewport.longitude,
          ~latitude=viewport.latitude,
          ~zoom=viewport.zoom,
          ~transitionDuration=2000,
          ~transitionInterpolator=Interpolator.FlyTo.make(),
          (),
        ),
      ),
    );
  };

  let onRouteAnswer = (r: API.Car.routeWithId) => {
    API.Travel.Socket.Events.acceptChange(
      r.id,
      /* dispatch(AcceptedRoute(r)); */
    );
  };

  React.useEffect0(() => {
    /* Socket.on(`RouteMatched, _id => */
    /*   API.Travel.routes(~callback=handleCar, ()) */
    /* ); */
    /* TODO: show new route and get explicit approval or denial from user */

    Socket.on(`RouteChangeRequested, API.Travel.Socket.Events.acceptChange);

    None;
  });

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    dispatch(
      ViewState(
        DeckGL.viewState(
          ~longitude=coords.longitude,
          ~latitude=coords.latitude,
          ~zoom=16,
          ~transitionDuration=2000,
          ~transitionInterpolator=Interpolator.FlyTo.make(),
          (),
        ),
      ),
    );
  };

  let geoJsonLayers =
    initialRoutes
    ->Belt.Option.map(carResponse =>
        Belt.Array.reduce(
          carResponse->Belt.List.toArray, [||], (group, response) =>
          Belt.Array.concat(group, response.route.routes)
        )
      )
    ->Belt.Option.getWithDefault([||])
    |> (data => GeoJsonLayer.make(~data, ()));

  let iconArray =
    initialRoutes
    ->Belt.Option.map(carResponse =>
        Belt.Array.reduce(
          carResponse->Belt.List.toArray, [||], (group, response) =>
          Belt.Array.concat(group, response.stops)
        )
      )
    ->Belt.Option.getWithDefault([||]);

  let iconLayers =
    iconArray->Belt.Array.mapWithIndex((i, stop) =>
      IconLayer.make(
        ~data=[|stop|],
        ~onHover=
          hoverInfo =>
            dispatch(
              Tooltip(ReactMap.IconLayer.hoverInfoFromJs(hoverInfo)),
            ),
        ~id={
          Js.Float.(
            String.concat(
              "-",
              [toString(stop.lat), toString(stop.lon), string_of_int(i)],
            )
          );
        },
        (),
      )
    );

  <>
    <Notifications />
    <TripDetails
      car={
        initialRoutes
        ->Belt.Option.map(routes =>
            switch (routes->Belt.List.get(0)) {
            | Some(r) => Some(r)
            | None => None
            }
          )
        ->Belt.Option.getWithDefault(None)
      }
      flyToRoute
    />
    <Map layers={[|geoJsonLayers|]->Belt.Array.concat(iconLayers)} tooltip />
  </>;
};
