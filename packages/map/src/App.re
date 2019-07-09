open Map;

[@react.component]
let make = () => {
  let (routes, setRoutes) = React.useState(() => []);
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
    let {waypoints}: API.Car.routeRoot = t.route;

    setRoutes(_ => [t.route.routes]);

    let first = waypoints->Belt.Array.get(0);
    let last = waypoints->Belt.Array.get(Belt.Array.length(waypoints) - 1);

    let arrayToLatLon = arr => {
      switch (arr->Belt.Array.get(0), arr->Belt.Array.get(1)) {
      | (Some(lat), Some(lon)) => (lat, lon)
      | (_, _) => (0.0, 0.0)
      };
    };

    let (longitude, latitude) =
      switch (first, last) {
      | (Some(f), Some(l)) =>
        GeoCenter.make([|
          f.location->arrayToLatLon,
          l.location->arrayToLatLon,
        |])
      | (Some(f), None) => f.location->arrayToLatLon
      | (None, Some(l)) => l.location->arrayToLatLon
      | (None, None) => (0.0, 0.0)
      };

    setViewState(_ =>
      DeckGL.viewState(
        ~longitude,
        ~latitude,
        ~zoom=16,
        ~transitionDuration=2000,
        ~transitionInterpolator=Interpolator.FlyTo.make(),
        (),
      )
    );
  };

  <>
    <div
      className="bg-white shadow-md absolute p-4 rounded z-10 w-96"
      style={ReactDOMRe.Style.make(~left="16px", ~top="16px", ())}>
      <Travel onCar=handleCar />
    </div>
    <Geolocation handleMove />
    <DeckGL
      controller=true
      effects=None
      onViewStateChange={vp => setViewState(_ => vp##viewState)}
      viewState
      layers={
        routes
        ->Belt.List.map(route => GeoJsonLayer.make(~data=route, ()))
        ->Belt.List.toArray
      }>
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
