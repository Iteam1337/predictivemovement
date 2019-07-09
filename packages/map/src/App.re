open Map;

[@react.component]
let make = () => {
  let (markers, setMarkers) = React.useState(() => []);

  let (viewState, setViewState) =
    React.useState(() =>
      DeckGL.viewState(
        ~longitude=18.068581,
        ~latitude=59.329323,
        ~zoom=10,
        (),
      )
    );

  let handleMove = (coords: Geolocation.Navigator.coords) => {
    setMarkers(_ => [coords]);

    setViewState(_ =>
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
    <div
      className="bg-white shadow-md absolute p-4 rounded z-10 w-96"
      style={ReactDOMRe.Style.make(~left="16px", ~top="16px", ())}>
      <Travel />
    </div>
    <Geolocation handleMove />
    <DeckGL
      controller=true
      effects=None
      onViewStateChange={vp => setViewState(_ => vp##viewState)}
      viewState
      layers=[||]>
      <StaticMap
        reuseMaps=true
        preventStyleDiffing=true
        mapboxApiAccessToken=Config.mapboxToken>
        {markers
         ->Belt.List.mapWithIndex((i, marker) =>
             <Marker
               longitude={marker.longitude}
               latitude={marker.latitude}
               key={i->string_of_int}>
               <div
                 className="rounded-full bg-blue-600 w-3 h-3 border-2
               border-white"
               />
             </Marker>
           )
         ->Belt.List.toArray
         ->React.array}
      </StaticMap>
    </DeckGL>
  </>;
};
