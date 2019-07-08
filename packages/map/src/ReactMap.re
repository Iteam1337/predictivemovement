module Map = {
  [@bs.module "react-map-gl"] [@react.component]
  external make:
    (
      ~mapStyle: Js.t('b),
      ~width: string,
      ~height: string,
      ~zoom: int,
      ~longitude: float,
      ~latitude: float,
      ~mapboxApiAccessToken: string,
      ~onViewportChange: Js.t('a) => unit,
      ~children: React.element
    ) =>
    React.element =
    "default";
};

module Marker = {
  [@bs.module "react-map-gl"] [@react.component]
  external make:
    (~latitude: float, ~longitude: float, ~children: React.element) =>
    React.element =
    "Marker";
};
