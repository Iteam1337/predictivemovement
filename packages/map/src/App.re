open Map;

let ingaro = [%bs.raw {|require("../../../src/routes/ingaro")|}];
let hasselby = [%bs.raw {|require("../../../src/routes/hasselby")|}];

[@react.component]
let make = () => {
  let hasselbyWaypoints = Waypoints.make(hasselby##waypoints);
  let ingaroWaypoints = Waypoints.make(ingaro##waypoints);
  let allWaypoints = Belt.Array.concat(hasselbyWaypoints, ingaroWaypoints);
  let (longitude, latitude) = GeoCenter.make(allWaypoints);

  let initialViewState =
    DeckGL.initialViewState(
      ~zoom=10,
      ~longitude,
      ~latitude,
      ~pitch=Some(45),
    );

  <>
    <div
      className="bg-white shadow-md absolute p-4 rounded z-10 w-96"
      style={ReactDOMRe.Style.make(~left="12px", ~top="12px", ())}>
      <Geolocation />
      <Travel />
    </div>
    <DeckGL
      controller=true
      effects=None
      initialViewState
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
      </StaticMap>
    </DeckGL>
  </>;
};
