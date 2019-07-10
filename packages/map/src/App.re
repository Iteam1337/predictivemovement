open Map;

[@react.component]
let make = () => {
  let (routes, setRoutes) = React.useState(() => []);
  let (stops, setStops) = React.useState(() => []);
  let (myLocation, setMyLocation) = React.useState(() => None);
  let (tooltip, setTooltip) =
    React.useState(_ => Map.IconLayer.{x: 0, y: 0, _object: None});

  let (viewState, setViewState) =
    React.useState(() =>
      DeckGL.viewState(~longitude=18.068581, ~latitude=59.329323, ~zoom=8, ())
    );

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    setMyLocation(_ => Some(coords));

    setViewState(_ =>
      DeckGL.viewState(
        ~longitude=coords.longitude,
        ~latitude=coords.latitude,
        ~zoom=16,
        ~transitionDuration=2000,
        ~transitionInterpolator=Interpolator.FlyTo.make(),
        (),
      )
    );
  };

  let handleCar = (t: API.Car.response) => {
    let {API.Car.route: {waypoints}, stops} = t;

    setRoutes(_ => [t.route.routes]);
    setStops(_ => [stops]);

    let viewport =
      Belt.Array.(
        switch (waypoints->get(0), waypoints->get(length(waypoints) - 1)) {
        | (Some(f), Some(l)) => [|f.location, l.location|]
        | (_, _) => [||]
        }
      )
      |> Viewport.make;

    setViewState(_ =>
      DeckGL.viewState(
        ~longitude=viewport.longitude,
        ~latitude=viewport.latitude,
        ~zoom=viewport.zoom,
        ~transitionDuration=2000,
        ~transitionInterpolator=Interpolator.FlyTo.make(),
        (),
      )
    );
  };

  let geoJsonLayers =
    routes->Belt.List.map(route => GeoJsonLayer.make(~data=route, ()));

  let iconLayers =
    stops->Belt.List.map(stop =>
      IconLayer.make(
        ~data=stop,
        ~onHover=d => setTooltip(_ => Map.IconLayer.hoverInfoFromJs(d)),
        (),
      )
    );

  <Geolocation.Provider value={myLocation: myLocation}>
    <Navigation handleCar />
    <Geolocation handleMove />
    <DeckGL
      controller=true
      onViewStateChange={vp => setViewState(_ => vp##viewState)}
      viewState
      layers={
        [|geoJsonLayers, iconLayers|]->Belt.List.concatMany->Belt.List.toArray
      }>
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
  </Geolocation.Provider>;
};