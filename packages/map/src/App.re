open Map;

type viewOrigin = [ | `Default | `Pending];

type state = {
  carResponse: option(list(API.Car.response)),
  myLocation: option(Geolocation.Navigator.coords),
  tooltip: Map.IconLayer.hoverInfo,
  viewState: Map.DeckGL.viewState,
  acceptedRoutes: list(API.Car.routeWithId),
  pendingRoutes: list(API.Car.routeWithId),
};

type action =
  | CarResponse(list(API.Car.response))
  | Location(Geolocation.Navigator.coords)
  | Tooltip(Map.IconLayer.hoverInfo)
  | ViewState(Map.DeckGL.viewState)
  | AcceptedRoute(API.Car.routeWithId)
  | PendingRoute(API.Car.routeWithId);

let initialState: state = {
  carResponse: None,
  myLocation: None,
  tooltip: {
    x: 0,
    y: 0,
    _object: None,
  },
  viewState:
    DeckGL.viewState(~longitude=18.068581, ~latitude=59.329323, ~zoom=8, ()),
  acceptedRoutes: [],
  pendingRoutes: [],
};

[@react.component]
let make = () => {
  let notifications = React.useContext(Notifications.Context.t);

  let (
    {
      carResponse,
      myLocation,
      viewState,
      tooltip,
      acceptedRoutes,
      pendingRoutes,
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
        | Location(location) => {...state, myLocation: Some(location)}
        | Tooltip(tooltip) => {...state, tooltip}
        | ViewState(viewState) => {...state, viewState}

        | AcceptedRoute(acceptedRoute) => {
            ...state,
            acceptedRoutes: [acceptedRoute, ...state.acceptedRoutes],
            pendingRoutes:
              state.pendingRoutes
              ->Belt.List.keep(({id}) => id !== acceptedRoute.id),
          }
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

    Socket.on(`RouteChangeRequested, API.Travel.Socket.Events.acceptChange);

    /* TODO(@all): Implement this again */
    /* Socket.on(`RouteChangeRequested, id => */
    /*   API.Travel.pendingRoute( */
    /*     ~callback= */
    /*       response => { */
    /*         let firstResponse = Belt.List.headExn(response); */
    /*         dispatch(PendingRoute({id, firstResponse})); */

    /*         notifications.updateNotifications( */
    /*           Notifications.Notification.make( */
    /*             ~title={j|Din resa har en matchning|j}, */
    /*             ~notificationType=`Success, */
    /*             ~onClick=Some(_ => ReasonReactRouter.push("/resor")), */
    /*             ~timeout=Some(5000), */
    /*             (), */
    /*           ), */
    /*         ); */
    /*       }, */
    /*     id, */
    /*   ) */
    /* ); */

    None;
  });

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    dispatch(Location(coords));
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
            dispatch(Tooltip(Map.IconLayer.hoverInfoFromJs(hoverInfo))),
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
    <Notifications />
    <Navigation
      onRouteSelect=handleCar
      onRouteAnswer
      acceptedRoutes
      pendingRoutes
    />
    <Geolocation handleMove />
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
    <DeckGL
      controller=true
      onViewStateChange={vp => dispatch(ViewState(vp##viewState))}
      viewState
      layers={[|geoJsonLayers|]->Belt.Array.concat(iconLayers)}>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapboxApiAccessToken=Config.mapboxToken>
        <>
          {switch (myLocation) {
           | None => React.null
           | Some({longitude, latitude}) =>
             <Geolocation.Marker longitude latitude />
           }}
          <Tooltip tooltip />
        </>
      </StaticMap>
    </DeckGL>
  </Geolocation.Context.Provider>;
};
