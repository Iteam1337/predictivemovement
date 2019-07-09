module Light = {
  module Ambient = {
    type t;

    [@bs.deriving abstract]
    type options = {
      color: array(int),
      intensity: float,
    };

    [@bs.new] [@bs.module "@deck.gl/core"]
    external create: options => t = "AmbientLight";

    let make = (~color, ~intensity) => create(options(~color, ~intensity));
  };

  module Point = {
    type t;

    [@bs.deriving abstract]
    type options = {
      color: array(int),
      intensity: float,
      position: array(float),
    };

    [@bs.new] [@bs.module "@deck.gl/core"]
    external create: options => t = "PointLight";

    let make = (~color, ~intensity, ~position) =>
      create(options(~color, ~intensity, ~position));
  };

  module LightingEffect = {
    type t;

    [@bs.deriving abstract]
    type options = {
      ambientLight: Ambient.t,
      pointLight: Point.t,
    };

    [@bs.new] [@bs.module "@deck.gl/core"]
    external create: options => t = "LightingEffect";

    let make = (~ambientLight, ~pointLight) =>
      create(options(~ambientLight, ~pointLight));
  };
};

module Map = {
  [@bs.module "react-map-gl"] [@react.component]
  external make:
    (~mapStyle: Js.t('b), ~mapboxApiAccessToken: string) => React.element =
    "default";
};

module StaticMap = {
  [@bs.module "react-map-gl"] [@react.component]
  external make:
    (
      ~children: React.element,
      ~reuseMaps: bool,
      ~preventStyleDiffing: bool,
      ~mapboxApiAccessToken: string
    ) =>
    React.element =
    "StaticMap";
};

module Marker = {
  [@bs.module "react-map-gl"] [@react.component]
  external make:
    (~latitude: float, ~longitude: float, ~children: React.element) =>
    React.element =
    "Marker";
};

module GeoJsonLayer = {
  type t;

  [@bs.deriving abstract]
  type layer('a) = {
    getLineColor: array(int),
    lineWidthMinPixels: int,
    data: array(Js.t('a)),
  };

  [@bs.new] [@bs.module "deck.gl"]
  external createLayer: layer('a) => t = "GeoJsonLayer";

  let make =
      (~data, ~getLineColor=[|74, 85, 104, 175|], ~lineWidthMinPixels=2, ()) =>
    createLayer(layer(~getLineColor, ~lineWidthMinPixels, ~data));
};

module TripsLayer = {
  type t;

  [@bs.deriving abstract]
  type layer('a) = {
    id: string,
    trailLength: int,
    getColor: array(int),
    widthMinPixels: int,
    opacity: float,
    rounded: bool,
    data: string,
    getPath: Js.t('a) => array('a),
    currentTime: float,
  };

  [@bs.new] [@bs.module "@deck.gl/geo-layers"]
  external createLayer: layer('a) => t = "TripsLayer";

  let make = (~id, ~data, ~currentTime) =>
    createLayer(
      layer(
        ~id,
        ~getColor=[|253, 128, 93|],
        ~getPath=d => d##segments,
        ~trailLength=50,
        ~widthMinPixels=2,
        ~data,
        ~rounded=true,
        ~currentTime,
        ~opacity=0.3,
      ),
    );
};

module DeckGL = {
  [@bs.deriving abstract]
  type initialViewState = {
    longitude: float,
    latitude: float,
    zoom: int,
    pitch: option(int),
  };

  [@bs.module "deck.gl"] [@react.component]
  external make:
    (
      ~effects: option(array(Light.LightingEffect.t)),
      ~controller: bool,
      ~initialViewState: initialViewState,
      ~layers: array(GeoJsonLayer.t),
      ~children: React.element
    ) =>
    React.element =
    "default";
};

module Waypoint = {
  type t = (float, float);

  let make: Js.t('a) => t =
    waypoint => (waypoint##location[0], waypoint##location[1]);
};

module Waypoints = {
  type t = array(Waypoint.t);

  let make: array(Js.t('a)) => t =
    waypoints => waypoints->Belt.Array.map(Waypoint.make);
};

module GeoCenter = {
  module Math = Js.Math;

  let degreeToRadian = value => value *. Math._PI /. 180.0;
  let radianToDegree = value => value *. 180.0 /. Math._PI;

  let median = ((x, y, z), total) => (x /. total, y /. total, z /. total);

  let make = coords => {
    switch (coords->Belt.Array.length) {
    | 0
    | 1 => (0.0, 0.0)
    | total =>
      let (x, y, z) =
        coords
        ->Belt.Array.reduce(
            (0.0, 0.0, 0.0),
            ((x, y, z), (longitude, latitude)) => {
              let lat = degreeToRadian(latitude);
              let long = degreeToRadian(longitude);

              (
                x +. Math.cos(lat) *. Math.cos(long),
                y +. Math.cos(lat) *. Math.sin(long),
                z +. Math.sin(lat),
              );
            },
          )
        ->median(total->float_of_int);

      let centralLongitude = Math.atan2(~y, ~x, ());
      let centralSquareRoot = Math.sqrt(x *. x +. y *. y);
      let centralLatitude = Math.atan2(~y=z, ~x=centralSquareRoot, ());

      (radianToDegree(centralLongitude), radianToDegree(centralLatitude));
    };
  };
};

/* ANIMATED TRIPS - keep for now */

/*type animationFrameID;*/

/*[@bs.val]*/
/*external requestAnimationFrame: (unit => unit) => animationFrameID = "";*/

/*[@bs.val] external cancelAnimationFrame: animationFrameID => unit = "";*/

/*let (time, setTime) = React.useState(() => 0.0);*/

/*let animate = () => {*/
/*let loopLength = 1800.0;*/
/*let speed = 30.0;*/
/*let timestamp = Js.Date.now() /. 1000.0;*/
/*let time = loopLength /. speed;*/

/*setTime(_ => mod_float(timestamp, time) /. time *. loopLength);*/
/*};*/

/*React.useEffect1(*/
/*() => {*/
/*let id = requestAnimationFrame(animate);*/
/*Some(() => cancelAnimationFrame(id));*/
/*},*/
/*[|time|],*/
/*);*/

/*TripsLayer.make(*/
/*~currentTime=time,*/
/*~id="trips",*/
/*~data=*/
/*"https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json",*/
/*),*/
