type t = {
  lat: float,
  lng: float,
};

let fromJson = json =>
  Json.Decode.{
    lat: json |> at(["geometry", "location", "lat"], Json.Decode.float),
    lng: json |> at(["geometry", "location", "lng"], Json.Decode.float),
  };

let fromArray = json =>
  json |> Json.Decode.(field("results", array(fromJson)));

let getCoordinates = address =>
  "https://maps.googleapis.com/maps/api/geocode/json?address="
  ++ address
  ++ "&key="
  ++ Config.googleApiToken;