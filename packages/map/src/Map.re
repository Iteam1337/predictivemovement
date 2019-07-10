module Interpolator = {
  type t;

  module FlyTo = {
    [@bs.new] [@bs.module "react-map-gl"]
    external make: unit => t = "FlyToInterpolator";
  };
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

module Layer = {
  type t;
};

module IconLayer = {
  [@bs.deriving abstract]
  type layer('a) = {
    data: array(API.Car.Stops.t),
    iconAtlas: string,
    iconMapping: Js.t('a),
    getIcon: API.Car.Stops.t => string,
    getPosition: API.Car.Stops.t => array(float),
    getSize: API.Car.Stops.t => int,
    getColor: API.Car.Stops.t => array(int),
    sizeScale: int,
  };

  [@bs.new] [@bs.module "deck.gl"]
  external createLayer: layer('a) => Layer.t = "IconLayer";

  let make =
      (
        ~data: array(API.Car.Stops.t),
        ~iconAtlas="https://deck.gl/images/icon-atlas.png",
        (),
      ) => {
    createLayer(
      layer(
        ~iconAtlas,
        ~iconMapping={
          "marker": {
            "x": 0,
            "y": 0,
            "width": 128,
            "height": 128,
            "mask": true,
          },
        },
        ~getIcon=_d => "marker",
        ~getPosition=d => [|d.lon, d.lat|],
        ~getSize=_d => 5,
        ~getColor=_d => [|236, 137, 54, 255|],
        ~sizeScale=8,
        ~data,
      ),
    );
  };
};

module GeoJsonLayer = {
  [@bs.deriving abstract]
  type layer('a) = {
    data: array(Js.t('a)),
    filled: bool,
    getLineColor: array(int),
    getFillColor: array(int),
    getRadius: int,
    lineWidthMinPixels: float,
    lineJointRounded: bool,
    pointRadiusScale: int,
    pointRadiusMaxPixelspointRadiusMaxPixels: int,
  };

  [@bs.new] [@bs.module "deck.gl"]
  external createLayer: layer('a) => Layer.t = "GeoJsonLayer";

  let make =
      (
        ~data: array(API.Car.route),
        ~filled=true,
        ~getLineColor=[|49, 130, 206, 255|],
        ~getFillColor=[|160, 160, 180, 200|],
        ~getRadius=100,
        ~lineWidthMinPixels=2.5,
        ~lineJointRounded=true,
        ~pointRadiusScale=1,
        ~pointRadiusMaxPixelspointRadiusMaxPixels=48,
        (),
      ) =>
    createLayer(
      layer(
        ~filled,
        ~getLineColor,
        ~getFillColor,
        ~getRadius,
        ~lineWidthMinPixels,
        ~lineJointRounded,
        ~pointRadiusScale,
        ~pointRadiusMaxPixelspointRadiusMaxPixels,
        ~data=
          data->Belt.Array.map(d =>
            {
              "geometry": {
                "coordinates": d.geometry.coordinates,
                "type": d.geometry._type,
              },
            }
          ),
      ),
    );
};

module DeckGL = {
  [@bs.deriving abstract]
  type viewState = {
    longitude: float,
    latitude: float,
    zoom: int,
    [@bs.optional]
    pitch: int,
    [@bs.optional]
    transitionDuration: int,
    [@bs.optional]
    transitionInterpolator: Interpolator.t,
  };

  [@bs.module "deck.gl"] [@react.component]
  external make:
    (
      ~controller: bool,
      ~layers: array(Layer.t),
      ~children: React.element,
      ~viewState: viewState,
      ~onViewStateChange: Js.t('a) => unit
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

module Viewport = {
  type t;

  [@bs.deriving {jsConverter: newType}]
  type viewport = {
    latitude: float,
    longitude: float,
    zoom: int,
  };

  [@bs.deriving abstract]
  type createOptions = {
    height: int,
    width: int,
  };

  [@bs.deriving abstract]
  type fitOptions = {
    padding: int,
    offset: array(int),
  };

  [@bs.new] [@bs.module "viewport-mercator-project"]
  external create: createOptions => t = "default";

  [@bs.send]
  external fit: (t, array(array(float)), fitOptions) => abs_viewport =
    "fitBounds";

  [@bs.val] [@bs.scope "window"] external innerWidth: int = "innerWidth";
  [@bs.val] [@bs.scope "window"] external innerHeight: int = "innerHeight";

  let make = coords => {
    create(createOptions(~height=innerHeight, ~width=innerWidth - 384))
    ->fit(coords, fitOptions(~padding=100, ~offset=[|200, 0|]))
    ->viewportFromJs;
  };
};
