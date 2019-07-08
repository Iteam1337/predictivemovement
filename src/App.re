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
      {zoom: 18, longitude: 18.4260733, latitude: 59.2827382},
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
    <Car longitude=18.4260733 latitude=59.2827382 />
    <Car longitude=18.4245319 latitude=59.2822026 />
  </ReactMap.Map>;
};
