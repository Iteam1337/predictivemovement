module Decode = Decode.AsResult.OfParseError;

type t = {
  lat: float,
  lng: float,
};

let make = (lat, lng) => {lat, lng};

let fromJson = json =>
  Decode.Pipeline.(
    succeed(make)
    |> at(["geometry", "location", "lat"], floatFromNumber)
    |> at(["geometry", "location", "lng"], floatFromNumber)
    |> run(json)
  );

let toJson = t =>
  Json.Encode.(
    object_([
      ("lat", Json.Encode.float(t.lat)),
      ("lon", Json.Encode.float(t.lng)),
    ])
  );

let fromArray = json => {
  Belt.Result.(
    json
    |> Decode.field("results", Decode.array(fromJson))
    |> (
      fun
      | Ok(d) =>
        switch (d->Belt.Array.get(0)) {
        | Some(position) => Ok(position)
        | None => Error("No results from GoogleGeocode")
        }
      | Error(_e) => Error("Could not decode Google Geocode-array")
    )
  );
};

let getCoordinates = address =>
  "https://maps.googleapis.com/maps/api/geocode/json?address="
  ++ address
  ++ "&key="
  ++ Config.googleApiToken;
