open Map;

let mapStyle = [%bs.raw {|require("../../../src/mapStyle")|}];
let ingaro = [%bs.raw {|require("../../../src/routes/ingaro")|}];
let hasselby = [%bs.raw {|require("../../../src/routes/hasselby")|}];

[@react.component]
let make = () => {
  let hasselbyWaypoints = hasselby##waypoints->Belt.Array.map(Waypoint.make);
  let ingaroWaypoints = ingaro##waypoints->Belt.Array.map(Waypoint.make);
  let (longitude, latitude) =
    GeoCenter.make(Belt.Array.concat(hasselbyWaypoints, ingaroWaypoints));

  let initialViewState =
    DeckGL.initialViewState(~zoom=10, ~longitude, ~latitude);

  <DeckGL
    controller=true
    initialViewState
    layers=[|
      GeoJsonLayer.make(~data=ingaro##routes, ()),
      GeoJsonLayer.make(~data=hasselby##routes, ()),
    |]>
    <StaticMap mapStyle=None mapboxApiAccessToken=Config.mapboxToken>
      {hasselbyWaypoints
       ->Belt.Array.mapWithIndex((i, coordinates) =>
           <Car coordinates key={i->string_of_int} />
         )
       ->React.array}
      {ingaroWaypoints
       ->Belt.Array.mapWithIndex((i, coordinates) =>
           <Car coordinates key={i->string_of_int} />
         )
       ->React.array}
    </StaticMap>
  </DeckGL>;
};
