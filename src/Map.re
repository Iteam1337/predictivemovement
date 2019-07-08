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
      ~mapStyle: option(Js.t('b)),
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

module FlyToInterpolator = {
  type t;

  [@bs.module "deck.gl"] [@bs.new]
  external make: unit => t = "FlyToInterpolator";
};

module DeckGL = {
  [@bs.deriving abstract]
  type initialViewState = {
    longitude: float,
    latitude: float,
    zoom: int,
    transitionDuration: option(int),
    transitionInterpolator: option(FlyToInterpolator.t),
  };

  [@bs.module "deck.gl"] [@react.component]
  external make:
    (
      ~controller: bool,
      ~initialViewState: initialViewState,
      ~layers: array(GeoJsonLayer.t),
      ~children: React.element,
      ~onViewStateChange: initialViewState => unit
    ) =>
    React.element =
    "default";
};

module Waypoint = {
  type t = (float, float);

  let make = waypoint => (waypoint##location[0], waypoint##location[1]);
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