type traveller =
  | Car
  | Person;

type t = {
  from: string,
  destination: string,
  traveller,
};

module Form = {
  [@react.component]
  let make = (~handleFormInput, ~handleCheckboxInput, ~handleSubmit) => {
    let (checked, setChecked) = React.useState(_ => false);

    let handleCheckbox = _ => {
      setChecked(c => {
        handleCheckboxInput(!c);
        !c;
      });
    };

    <form onSubmit=handleSubmit>
      <Input.Text
        placeholder="Startpunkt"
        onChange={event =>
          handleFormInput(`From, ReactEvent.Form.target(event)##value)
        }
      />
      <Input.Text
        className="mt-2"
        onChange={event =>
          handleFormInput(`Destination, ReactEvent.Form.target(event)##value)
        }
        placeholder="Destination"
      />
      <div className="mt-2">
        <Input.Checkbox checked label="Jag har bil" onChange=handleCheckbox />
      </div>
      <div className="mt-2">
        <Button.Primary type_="submit">
          {React.string("Skicka")}
        </Button.Primary>
      </div>
    </form>;
  };
};

[@react.component]
let make = () => {
  let initialState = {from: "", destination: "", traveller: Person};

  let (formData, setFormData) = React.useState(_ => initialState);

  let postDirections = data => {
    switch (formData.traveller) {
    | Person =>
      Js.Promise.(
        API.Travel.make(
          ~route=`Person,
          ~method_=Post,
          ~body=
            Json.Encode.(
              object_([
                ("from", GoogleGeocode.toJson(data[0])),
                ("to", GoogleGeocode.toJson(data[1])),
              ])
            ),
        )
        |> then_(data => Js.log(data) |> resolve)
        |> ignore
      )
    | Car =>
      Js.Promise.(
        API.Travel.make(
          ~route=`Car,
          ~method_=Post,
          ~body=
            Json.Encode.(
              object_([
                ("from", GoogleGeocode.toJson(data[0])),
                ("to", GoogleGeocode.toJson(data[1])),
              ])
            ),
        )
        |> then_(data => Js.log(data) |> resolve)
        |> ignore
      )
    };
  };

  let getCoordinates = callback => {
    Js.Promise.(
      [|formData.from, formData.destination|]
      |> Array.map(address =>
           Fetch.fetch(GoogleGeocode.getCoordinates(address))
           |> then_(Fetch.Response.json)
           |> then_(data =>
                resolve(data |> GoogleGeocode.fromArray |> (d => d[0]))
              )
         )
      |> all
      |> then_(data => callback(data) |> resolve)
      |> ignore
    );
  };

  let handleFormSubmit = event => {
    ReactEvent.Synthetic.preventDefault(event);

    getCoordinates(postDirections);
  };

  let handleFormInput = (identifier, value) => {
    switch (identifier) {
    | `From => setFormData(fd => {...fd, from: value})
    | `Destination => setFormData(fd => {...fd, destination: value})
    };
  };

  let handleCheckboxInput = value =>
    setFormData(fd => {...fd, traveller: value ? Car : Person});

  <div>
    <Form handleFormInput handleCheckboxInput handleSubmit=handleFormSubmit />
  </div>;
};
