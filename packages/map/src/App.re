open Map;

let ingaro = [%bs.raw {|require("../../../src/routes/ingaro")|}];
let hasselby = [%bs.raw {|require("../../../src/routes/hasselby")|}];

[@react.component]
let make = () => {
  let hasselbyWaypoints = Waypoints.make(hasselby##waypoints);
  let ingaroWaypoints = Waypoints.make(ingaro##waypoints);
  let allWaypoints = Belt.Array.concat(hasselbyWaypoints, ingaroWaypoints);
  let (longitude, latitude) = GeoCenter.make(allWaypoints);
  let (markers, setMarkers) = React.useState(() => []);

  let (viewState, setViewState) =
    React.useState(() =>
      DeckGL.viewState(~longitude, ~latitude, ~zoom=10, ())
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

  <>
    <div
      className="bg-white shadow-md absolute p-4 rounded z-10 w-96"
      style={ReactDOMRe.Style.make(~left="16px", ~top="16px", ())}>
      <Travel />
    </div>
    <Geolocation handleMove />
    <DeckGL
      controller=true
      effects=None
      onViewStateChange={vp => setViewState(_ => vp##viewState)}
      viewState
      layers=[|
        GeoJsonLayer.make(~data=hasselby##routes, ()),
        GeoJsonLayer.make(~data=ingaro##routes, ()),
      |]>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapboxApiAccessToken=Config.mapboxToken>
        {allWaypoints
         ->Belt.Array.mapWithIndex((i, coordinates) =>
             <Car coordinates key={i->string_of_int} />
           )
         ->React.array}
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
