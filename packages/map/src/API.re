module Travel = {
  module Route = {
    let fromType =
      fun
      | `Person => "person"
      | `Car => "car";
  };

  let make = (~route, ~method_, ~body) =>
    Js.Promise.(
      Fetch.fetchWithInit(
        Route.fromType(route),
        Fetch.RequestInit.make(
          ~method_,
          ~body=Fetch.BodyInit.make(Js.Json.stringify(body)),
          ~headers=
            Fetch.HeadersInit.make({"Content-Type": "application/json"}),
          (),
        ),
      )
      |> then_(Fetch.Response.json)
    );
};
