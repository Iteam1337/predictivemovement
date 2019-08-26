open ReactMap;

type viewOrigin = [ | `Default | `Pending];

type state = {
  carResponse: option(list(API.Car.response)),
  mapLocation: option(MapTest.ReactMap.DeckGL.viewState),
  myLocation: option(Geolocation.Navigator.coords),
  tooltip: ReactMap.IconLayer.hoverInfo,
  acceptedRoutes: list(API.Car.routeWithId),
  pendingRoutes: list(API.Car.routeWithId),
};

type action =
  | CarResponse(list(API.Car.response))
  | MapLocation(MapTest.ReactMap.DeckGL.viewState)
  | Location(Geolocation.Navigator.coords)
  | Tooltip(ReactMap.IconLayer.hoverInfo)
  | AcceptedRoute(API.Car.routeWithId)
  | PendingRoute(API.Car.routeWithId);

let initialState: state = {
  tooltip: {
    x: 0,
    y: 0,
    _object: None,
  },
  carResponse: None,
  mapLocation: None,
  myLocation: None,
  acceptedRoutes: [],
  pendingRoutes: [],
};

[@react.component]
let make = () => {
  let notifications = React.useContext(Notifications.Context.t);

  let (
    {
      carResponse,
      mapLocation,
      myLocation,
      acceptedRoutes,
      pendingRoutes,
      tooltip,
    },
    dispatch,
  ) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | CarResponse(carResponse) => {
            ...state,
            carResponse: Some(carResponse),
          }
        | MapLocation(location) => {...state, mapLocation: Some(location)}
        | Location(location) => {...state, myLocation: Some(location)}

        | AcceptedRoute(acceptedRoute) => {
            ...state,
            acceptedRoutes: [acceptedRoute, ...state.acceptedRoutes],
            pendingRoutes:
              state.pendingRoutes
              ->Belt.List.keep(({id}) => id !== acceptedRoute.id),
          }
        | Tooltip(tooltip) => {...state, tooltip}
        | PendingRoute(pendingRoute) => {
            ...state,
            pendingRoutes: [pendingRoute, ...state.pendingRoutes],
          }
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
      MapLocation(
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

  let handleCar = routes => {
    dispatch(CarResponse(routes));

    switch (routes->Belt.List.get(Belt.List.length(routes) - 1)) {
    | Some({route: {waypoints}}) => flyToRoute(waypoints)
    | _ => ()
    };
  };

  let onRouteAnswer = (r: API.Car.routeWithId) => {
    API.Travel.Socket.Events.acceptChange(r.id);

    dispatch(AcceptedRoute(r));
  };

  React.useEffect0(() => {
    Socket.on(`RouteMatched, _id =>
      API.Travel.routes(~callback=handleCar, ())
    );
    /* TODO: show new route and get explicit approval or denial from user */

    Socket.on(`RouteChangeRequested, id =>
      API.Travel.pendingRoute(
        ~callback=
          response => {
            dispatch(PendingRoute({id, response}));

            notifications.updateNotifications(
              Notifications.Notification.make(
                ~title={j|Din resa har en matchning|j},
                ~notificationType=`Success,
                ~onClick=Some(_ => ReasonReactRouter.push("/resor")),
                ~timeout=Some(5000),
                (),
              ),
            );
          },
        id,
      )
    );

    None;
  });

  let geoJsonLayers =
    carResponse
    ->Belt.Option.map(carResponse =>
        Belt.Array.reduce(
          carResponse->Belt.List.toArray, [||], (group, response) =>
          Belt.Array.concat(group, response.route.routes)
        )
      )
    ->Belt.Option.getWithDefault([||])
    |> (data => GeoJsonLayer.make(~data, ()));

  let iconArray =
    carResponse
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

  <Geolocation.Context.Provider value={myLocation: myLocation}>
    <Navigation
      onRouteSelect=handleCar
      onRouteAnswer
      acceptedRoutes
      pendingRoutes
    />
    <TripDetails
      car={
        carResponse
        ->Belt.Option.map(carResponse =>
            switch (carResponse->Belt.List.get(0)) {
            | Some(r) => Some(r)
            | None => None
            }
          )
        ->Belt.Option.getWithDefault(None)
      }
      flyToRoute
    />
    <Map
      layers={[|geoJsonLayers|]->Belt.Array.concat(iconLayers)}
      onMove={coords => dispatch(Location(coords))}
      ?myLocation
      ?mapLocation
      tooltip
    />
  </Geolocation.Context.Provider>;
};