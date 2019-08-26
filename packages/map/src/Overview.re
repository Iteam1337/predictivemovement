open ReactMap;

type state = {
  initialRoutes: option(list(API.Car.response)),
  optimisedRoutes: option(list(API.Car.response)),
  tooltip: ReactMap.IconLayer.hoverInfo,
};

type action =
  | Tooltip(ReactMap.IconLayer.hoverInfo);

let initialState: state = {
  initialRoutes: None,
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
        | Tooltip(tooltip) => {...state, tooltip}
        },
      initialState,
    );

  React.useEffect0(() => {
    Socket.on(`RouteChangeRequested, API.Travel.Socket.Events.acceptChange);

    None;
  });

  let geoJsonLayers =
    initialRoutes
    ->Belt.Option.map(carResponse =>
        Belt.Array.reduce(
          carResponse->Belt.List.toArray, [||], (group, response) =>
          Belt.Array.concat(group, response.route.routes)
        )
      )
    ->Belt.Option.getWithDefault([||])
    |> (data => GeoJsonLayer.make(~data, ()));

  let iconArray =
    initialRoutes
    ->Belt.Option.map(carResponse =>
        Belt.Array.reduce(
          carResponse->Belt.List.toArray, [||], (group, response) =>
          Belt.Array.concat(group, response.stops)
        )
      )
    ->Belt.Option.getWithDefault([||]);

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
      layers={[|geoJsonLayers|]->Belt.Array.concat(iconLayers)}
      tooltip
    />
  </>;
};