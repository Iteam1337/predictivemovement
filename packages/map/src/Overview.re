open ReactMap;

type state = {
  initialRoutes: list(API.Car.response),
  optimisedRoutes: option(list(API.Car.response)),
  tooltip: ReactMap.IconLayer.hoverInfo,
};

type action =
  | Routes(list(API.Car.response))
  | Tooltip(ReactMap.IconLayer.hoverInfo);

let initialState: state = {
  initialRoutes: [],
  optimisedRoutes: None,
  tooltip: {
    x: 0,
    y: 0,
    _object: None,
  },
};

let initialViewPosition =
  DeckGL.viewState(~longitude=19.837932, ~latitude=66.605854, ~zoom=7, ());

[@react.component]
let make = () => {
  let ({tooltip, initialRoutes}, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | Routes(initialRoutes) => {...state, initialRoutes}
        | Tooltip(tooltip) => {...state, tooltip}
        },
      initialState,
    );

  React.useEffect0(() => {
    API.Travel.routes(~callback=routes => dispatch(Routes(routes)), ());

    None;
  });

  React.useEffect0(() => {
    API.Travel.tempGenerate(~callback=data => Js.log(data));

    None;
  });

  let geoJsonLayers =
    initialRoutes
    ->Belt.List.reduce([||], (group, response) =>
        Belt.Array.concat(group, response.route.routes)
      )
    ->Belt.Array.map(r => GeoJsonLayer.make(~data=[|r|], ()));

  let iconArray =
    initialRoutes->Belt.List.reduce([||], (group, response) =>
      Belt.Array.concat(group, response.stops)
    );

  let iconLayers =
    iconArray->Belt.Array.mapWithIndex((i, stop) =>
      IconLayer.make(
        ~data=[|stop|],
        ~onHover=
          hoverInfo =>
            dispatch(
              Tooltip(ReactMap.IconLayer.hoverInfoFromJs(hoverInfo)),
            ),
        ~id={
          Js.Float.(
            String.concat(
              "-",
              [toString(stop.lat), toString(stop.lon), string_of_int(i)],
            )
          );
        },
        (),
      )
    );

  <>
    <Map
      mapLocation=initialViewPosition
      layers={[|geoJsonLayers, iconLayers|]->Belt.Array.concatMany}
      tooltip
    />
  </>;
};