open Map;

[@react.component]
let make = () => {
  let (routes, setRoutes) = React.useState(() => []);
  let (stops, setStops) = React.useState(() => []);
  let (markers, setMarkers) = React.useState(() => []);

  let (viewState, setViewState) =
    React.useState(() =>
      DeckGL.viewState(~longitude=18.068581, ~latitude=59.329323, ~zoom=8, ())
    );

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    setMarkers(_ => [coords]);

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
    routes
    ->Belt.List.map(route => GeoJsonLayer.make(~data=route, ()))
    ->Belt.List.toArray;

  let iconLayers =
    stops
    ->Belt.List.map(stop => IconLayer.make(~data=stop, ()))
    ->Belt.List.toArray;

  <>
    <div
      className="bg-white shadow-md absolute p-4 rounded z-10 w-96"
      style={ReactDOMRe.Style.make(~left="16px", ~top="16px", ())}>
      <Travel onCar=handleCar />
    </div>
    <Geolocation handleMove />
    <DeckGL
      controller=true
      onViewStateChange={vp => setViewState(_ => vp##viewState)}
      viewState
      layers={[|geoJsonLayers, iconLayers|]->Belt.Array.concatMany}>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapboxApiAccessToken=Config.mapboxToken>
        {markers
         ->Belt.List.mapWithIndex((i, marker) =>
             <Marker
               longitude={marker.longitude}
               latitude={marker.latitude}
               key={i->string_of_int}>
               <div
                 className="rounded-full bg-blue-600 w-3 h-3 border-2
               border-white"
               />
             </Marker>
           )
         ->Belt.List.toArray
         ->React.array}
      </StaticMap>
    </DeckGL>
  </>;
};
