let mapStyle = [%bs.raw {|require("../../../src/mapStyle")|}];

type viewport = {
  latitude: float,
  longitude: float,
  zoom: int,
};

type action('a) =
  | UpdateMap(Js.t('a));

[@react.component]
let make = () => {
  let (initialLongitude, initialLatitude) = Location.make(`Umea);
  let ({latitude, longitude, zoom}, dispatch) =
    React.useReducer(
      (_state, action) =>
        switch (action) {
        | UpdateMap(viewport) => {
            longitude: viewport##longitude,
            latitude: viewport##latitude,
            zoom: viewport##zoom,
          }
        },
      {zoom: 5, longitude: initialLongitude, latitude: initialLatitude},
    );

  <ReactMap.Map
    mapStyle
    width="100vw"
    height="100vh"
    zoom
    longitude
    latitude
    onViewportChange={viewport => dispatch(UpdateMap(viewport))}
    mapboxApiAccessToken=Config.mapboxToken>
    <Car location=`Boden />
    <Car location=`Umea />
    <Car location=`Tarnaby />
    <Car location=`Storuman />
    <Car location=`Stockholm />
  </ReactMap.Map>;
};
