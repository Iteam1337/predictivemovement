open ReactMap;

type state = {viewState: ReactMap.DeckGL.viewState};

type action =
  | ViewState(ReactMap.DeckGL.viewState);

[@react.component]
let make =
    (
      ~layers,
      ~myLocation: option(Geolocation.Navigator.coords)=?,
      ~mapLocation: option(MapTest.ReactMap.DeckGL.viewState)=?,
      ~onMove=?,
      ~tooltip,
    ) => {
  let (viewState, setViewState) =
    React.useState(_ =>
      DeckGL.viewState(~longitude=18.068581, ~latitude=59.329323, ~zoom=8, ())
    );

  React.useEffect1(
    () => {
      switch (mapLocation) {
      | Some(location) => setViewState(_prevMapLocation => location)
      | None => ()
      };

      None;
    },
    [|mapLocation|],
  );

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    Utils.invokeIfSet(~callback=onMove, coords);

    setViewState(_prevViewState =>
      DeckGL.viewState(
        ~longitude=coords.longitude,
        ~latitude=coords.latitude,
        ~zoom=16,
        ~transitionDuration=2000,
        ~transitionInterpolator=Interpolator.FlyTo.make(),
        (),
      )
    );
  };

  <>
    <Geolocation handleMove />
    <DeckGL
      controller=true
      onViewStateChange={vp => setViewState(_prev => vp##viewState)}
      viewState
      layers>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapboxApiAccessToken=Config.mapboxToken>
        <>
          {switch (myLocation) {
           | None => React.null
           | Some({longitude, latitude}) =>
             <Geolocation.Marker longitude latitude />
           }}
          <Tooltip tooltip />
        </>
      </StaticMap>
    </DeckGL>
  </>;
};