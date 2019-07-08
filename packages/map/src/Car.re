[@react.component]
let make = (~coordinates) => {
  let (longitude, latitude) = coordinates;

  <Map.Marker longitude latitude>
    <div className="w-2 h-2 bg-orange-400 rounded-full" />
  </Map.Marker>;
};
