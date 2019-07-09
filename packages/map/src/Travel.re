type traveller =
  | Car
  | Person;

type t = {
  date: string,
  from: string,
  destination: string,
  traveller,
};

module Form = {
  [@react.component]
  let make = (~state, ~handleFormInput, ~handleCheckboxInput, ~handleSubmit) => {
    let (checked, setChecked) = React.useState(_ => false);

    let handleCheckbox = _ => {
      setChecked(c => {
        handleCheckboxInput(!c);
        !c;
      });
    };

    <form onSubmit=handleSubmit>
      <Input.Text
        placeholder="Datum"
        onChange={event =>
          handleFormInput(`Date, ReactEvent.Form.target(event)##value)
        }
        value={state.date}
      />
      <Input.Text
        className="mt-2"
        placeholder="Startpunkt"
        onChange={event =>
          handleFormInput(`From, ReactEvent.Form.target(event)##value)
        }
        value={state.from}
      />
      <Input.Text
        className="mt-2"
        onChange={event =>
          handleFormInput(`Destination, ReactEvent.Form.target(event)##value)
        }
        placeholder="Destination"
        value={state.destination}
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
let make = (~onCar) => {
  let initialState = {
    date: Js.Date.make() |> Js.Date.toISOString,
    from: "",
    destination: "",
    traveller: Person,
  };

  let (formData, setFormData) = React.useState(_ => initialState);

  let makeBody = (start, destination) => {
    Json.Encode.(
      object_([
        (
          "start",
          object_([
            ("date", string(formData.date)),
            ("position", GoogleGeocode.toJson(start)),
          ]),
        ),
        (
          "end",
          object_([
            ("date", string(formData.date)),
            ("position", GoogleGeocode.toJson(destination)),
          ]),
        ),
      ])
    );
  };

  let postDirections = data => {
    Belt.Result.(
      switch (Belt.List.getExn(data, 0), Belt.List.getExn(data, 1)) {
      | (Ok(start), Ok(destination)) =>
        switch (formData.traveller) {
        | Person =>
          Repromise.(
            API.Travel.make(
              ~route=`Person,
              ~method_=Post,
              ~body=makeBody(start, destination),
            )
            |> wait(
                 fun
                 | Ok(data) => Js.log2("Success", data)
                 | Error(e) => Js.log2("Error", e),
               )
          )
        | Car =>
          Repromise.(
            API.Travel.make(
              ~route=`Car,
              ~method_=Post,
              ~body=makeBody(start, destination),
            )
            |> wait(
                 fun
                 | Ok(data) => onCar(data |> API.Car.fromJson)
                 | Error(e) => Js.log2("Error", e),
               )
          )
        }
      | _ => Js.log("Error while getting coordinates")
      }
    );
  };

  let getCoordinates = callback => {
    [formData.from, formData.destination]
    ->Belt.List.map(address =>
        Refetch.fetch(GoogleGeocode.getCoordinates(address))
        |> Repromise.andThen(Refetch.json)
        |> Repromise.map(GoogleGeocode.fromArray)
      )
    |> Repromise.all
    |> Repromise.wait(callback);
  };

  let handleFormSubmit = event => {
    ReactEvent.Synthetic.preventDefault(event);

    getCoordinates(postDirections);
  };

  let handleFormInput = (identifier, value) => {
    switch (identifier) {
    | `Date => setFormData(fd => {...fd, date: value})
    | `From => setFormData(fd => {...fd, from: value})
    | `Destination => setFormData(fd => {...fd, destination: value})
    };
  };

  let handleCheckboxInput = value =>
    setFormData(fd => {...fd, traveller: value ? Car : Person});

  <div>
    <Form
      handleFormInput
      handleCheckboxInput
      handleSubmit=handleFormSubmit
      state=formData
    />
  </div>;
};
