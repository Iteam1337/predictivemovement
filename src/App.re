type animationFrameID;

[@bs.val]
external requestAnimationFrame: (unit => unit) => animationFrameID = "";

[@bs.val] external cancelAnimationFrame: animationFrameID => unit = "";

open Map;

let ingaro = [%bs.raw {|require("../../../src/routes/ingaro")|}];
let hasselby = [%bs.raw {|require("../../../src/routes/hasselby")|}];

[@react.component]
let make = () => {
  let (time, setTime) = React.useState(() => 0.0);
  let hasselbyWaypoints = Waypoints.make(hasselby##waypoints);
  let ingaroWaypoints = Waypoints.make(ingaro##waypoints);
  let allWaypoints = Belt.Array.concat(hasselbyWaypoints, ingaroWaypoints);
  /*let (longitude, latitude) = GeoCenter.make(allWaypoints);*/

  let animate = () => {
    let loopLength = 1800.0;
    let speed = 30.0;
    let timestamp = Js.Date.now() /. 1000.0;
    let time = loopLength /. speed;

    setTime(_ => mod_float(timestamp, time) /. time *. loopLength);
  };

  React.useEffect1(
    () => {
      let id = requestAnimationFrame(animate);
      Some(() => cancelAnimationFrame(id));
    },
    [|time|],
  );

  let initialViewState =
    DeckGL.initialViewState(
      ~zoom=10,
      ~longitude=-74.0,
      ~latitude=40.72,
      ~pitch=Some(45),
    );

  <>
    <Travel />
    <DeckGL
      controller=true
      effects=None
      initialViewState
      layers=[|
        TripsLayer.make(
          ~currentTime=time,
          ~id="trips",
          ~data=
            "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json",
        ),
      |]>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapStyle="mapbox://styles/mapbox/dark-v10"
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
