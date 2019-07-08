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
    lineWidthScale: int,
    lineWidthMinPixels: int,
    data: array(Js.t('a)),
  };

  [@bs.new] [@bs.module "deck.gl"]
  external createLayer: layer('a) => t = "GeoJsonLayer";

  let make =
      (
        ~data,
        ~getLineColor=[|74, 85, 104, 175|],
        ~lineWidthMinPixels=2,
        ~lineWidthScale=5,
        (),
      ) =>
    createLayer(
      layer(~getLineColor, ~lineWidthScale, ~lineWidthMinPixels, ~data),
    );
};

module DeckGL = {
  [@bs.deriving abstract]
  type initialViewState = {
    longitude: float,
    latitude: float,
    zoom: int,
  };

  [@bs.module "deck.gl"] [@react.component]
  external make:
    (
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

  let make = waypoint => (waypoint##location[0], waypoint##location[1]);
};

module GeoCenter = {
  let average = coords => {
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;
    ();
  };
};

/*function averageGeolocation(coords) {*/
/*if (coords.length === 1) {*/
/*return coords[0];*/

/*}*/

/*let x = 0.0;*/
/*let y = 0.0;*/
/*let z = 0.0;*/

/*for (let coord of coords) {*/
/*let latitude = coord.latitude * Math.PI / 180;*/
/*let longitude = coord.longitude * Math.PI / 180;*/

/*x += Math.cos(latitude) * Math.cos(longitude);*/
/*y += Math.cos(latitude) * Math.sin(longitude);*/
/*z += Math.sin(latitude);*/

/*}*/

/*let total = coords.length;*/

/*x = x / total;*/
/*y = y / total;*/
/*z = z / total;*/

/*let centralLongitude = Math.atan2(y, x);*/
/*let centralSquareRoot = Math.sqrt(x * x + y * y);*/
/*let centralLatitude = Math.atan2(z, centralSquareRoot);*/

/*return {*/
/*latitude: centralLatitude * 180 / Math.PI,*/
/*longitude: centralLongitude * 180 / Math.PI*/

/*};*/

/*}*/
