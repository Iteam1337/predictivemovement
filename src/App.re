open Map;

let mapStyle = [%bs.raw {|require("../../../src/mapStyle")|}];
let ingaro = [%bs.raw {|require("../../../src/routes/ingaro")|}];
let hasselby = [%bs.raw {|require("../../../src/routes/hasselby")|}];

[@react.component]
let make = () => {
  let initialViewState =
    DeckGL.initialViewState(
      ~zoom=10,
      ~longitude=18.512221,
      ~latitude=59.245505,
    );

  <DeckGL
    controller=true
    initialViewState
    layers=[|
      GeoJsonLayer.make(~data=ingaro##routes, ()),
      GeoJsonLayer.make(~data=hasselby##routes, ()),
    |]>
    <StaticMap mapStyle=None mapboxApiAccessToken=Config.mapboxToken>
      {hasselby##waypoints
       ->Belt.Array.map(Waypoint.make)
       ->Belt.Array.map(coordinates => <Car coordinates />)
       ->React.array}
      {ingaro##waypoints
       ->Belt.Array.map(Waypoint.make)
       ->Belt.Array.map(coordinates => <Car coordinates />)
       ->React.array}
    </StaticMap>
  </DeckGL>;
};
