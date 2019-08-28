open ReactMap;

type viewState = [ | `Pending | `Optimised | `None | `RouteDetails];
type state = {
  pendingRoutes: list(API.Car.response),
  optimisedRoutes: list(API.Car.response),
  tooltip: ReactMap.IconLayer.hoverInfo,
  currentViewState: viewState,
  currentRouteDetails: list(API.Car.routeDetails),
};

type action =
  | PendingRoutes(list(API.Car.response))
  | CurrentRouteDetails(list(API.Car.routeDetails))
  | OptimisedRoutes(list(API.Car.response))
  | CurrentViewState(viewState)
  | Tooltip(ReactMap.IconLayer.hoverInfo);

let initialState: state = {
  pendingRoutes: [],
  optimisedRoutes: [],
  currentViewState: `Pending,
  currentRouteDetails: [],
  tooltip: {
    x: 0,
    y: 0,
    _object: None,
  },
};

let initialViewPosition =
  DeckGL.viewState(~longitude=19.837932, ~latitude=66.605854, ~zoom=7, ());

let colorize = (~routeType, ~currentViewState, routes) =>
  routes->Belt.List.map((x: API.Car.response) =>
    {
      ...x,
      route: {
        ...x.route,
        routes:
          x.route.routes
          ->Belt.Array.map(y =>
              {
                ...y,
                properties: {
                  color:
                    switch (routeType, currentViewState) {
                    | (`Pending, `Pending) => [|255, 0, 0, 100|]
                    | (`Pending, _) => [|120, 120, 120, 120|]
                    | (`Optimised, `Optimised) => [|0, 0, 255, 100|]
                    | (`Optimised, _) => [|120, 120, 120, 120|]
                    | _ => [|0, 255, 0, 255|]
                    },
                },
              }
            ),
      },
    }
  );

[@react.component]
let make = () => {
  let (
    {
      tooltip,
      pendingRoutes,
      optimisedRoutes,
      currentViewState,
      currentRouteDetails,
    },
    dispatch,
  ) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | PendingRoutes(pendingRoutes) => {...state, pendingRoutes}
        | OptimisedRoutes(optimisedRoutes) => {...state, optimisedRoutes}
        | CurrentRouteDetails(currentRouteDetails) => {
            ...state,
            currentRouteDetails,
          }
        | Tooltip(tooltip) => {...state, tooltip}
        | CurrentViewState(currentViewState) => {...state, currentViewState}
        },
      initialState,
    );

  React.useEffect0(() => {
    API.Travel.optimisedRoutes(
      ~callback=routes => dispatch(OptimisedRoutes(routes)),
      (),
    );

    API.Travel.pendingRoutes(
      ~callback=routes => dispatch(PendingRoutes(routes)),
      (),
    );

    None;
  });

  let colorizedRoutes =
    Belt.List.concat(
      colorize(~routeType=`Pending, ~currentViewState, pendingRoutes),
      colorize(~routeType=`Optimised, ~currentViewState, optimisedRoutes),
    );

  let geoJsonLayers =
    currentRouteDetails
    ->Belt.List.reduce([||], (group, routeDetails) =>
        Belt.Array.concat(group, [|routeDetails.geometry|])
      )
    ->Belt.Array.mapWithIndex((index, geometry) =>
        GeoJsonLayer.make(
          ~data=[|
            API.Car.makeRoute(
              ~geometry,
              ~properties={
                color:
                  switch (index) {
                  | 0 => [|229, 62, 62, 255|]
                  | 1 => [|246, 224, 94, 255|]
                  | 2 => [|72, 187, 120, 255|]
                  | 3 => [|237, 100, 166, 255|]
                  | _ => [|255, 179, 237, 255|]
                  },
              },
            ),
          |],
          (),
        )
      );

  /* let geoJsonLayers = */
  /*   colorizedRoutes */
  /*   ->Belt.List.reduce([||], (group, response) => */
  /*       Belt.Array.concat(group, response.route.routes) */
  /*     ) */
  /*   ->Belt.Array.map(r => GeoJsonLayer.make(~data=[|r|], ())); */

  let iconArray = currentRouteDetails =>
    currentRouteDetails->Belt.List.reduce([||], (group, route) =>
      Belt.Array.concat(group, route.API.Car.stops)
    );

  let handleRouteClick = (~id) => {
    API.Travel.routeDetails(
      ~url="/demo/route/",
      ~callback=data => dispatch(CurrentRouteDetails(data)),
      id,
    );
  };

  let iconLayers =
    iconArray(currentRouteDetails)
    ->Belt.Array.mapWithIndex((i, stop) =>
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
    <div className="absolute flex-col right-0 top-0 z-10 w-3/12 rounded  m-5">
      // <Button.Secondary onClick={_ => dispatch(CurrentViewState(`Pending))}>
      //   "Pending"->React.string
      // </Button.Secondary>
      // <Button.Primary onClick={_ => dispatch(CurrentViewState(`Optimised))}>
      //   "Optimised"->React.string
      // </Button.Primary>

        <div className="flex-col p-5 pb-0 rounded bg-white">
          {optimisedRoutes
           ->Belt.List.mapWithIndex((i, x) =>
               <Button.Primary
                 className="mb-5"
                 key={x.id}
                 onClick={_ => handleRouteClick(~id=x.API.Car.id)}>
                 {j| Rutt $i |j}->React.string
               </Button.Primary>
             )
           ->Belt.List.toArray
           ->React.array}
        </div>
        <RouteDetails details=currentRouteDetails />
      </div>
    <Map
      mapLocation=initialViewPosition
      layers={[|geoJsonLayers, iconLayers|]->Belt.Array.concatMany}
      tooltip
    />
  </>;
};