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
      <input
        placeholder="Ange startpunkt"
        onChange={event =>
          handleFormInput(`From, ReactEvent.Form.target(event)##value)
        }
      />
      <input
        onChange={event =>
          handleFormInput(`Destination, ReactEvent.Form.target(event)##value)
        }
        placeholder="Ange destination"
      />
      <div>
        <label>
          "Jag har bil"->React.string
          <input onChange=handleCheckbox checked type_="checkbox" />
        </label>
      </div>
      <div style={ReactDOMRe.Style.make(~marginTop="6px", ())}>
        <button type_="submit"> {React.string("Skicka")} </button>
      </div>
    </form>;
  };
};

[@react.component]
let make = () => {
  let initialState = {from: "", destination: "", traveller: Person};

  let (formData, setFormData) = React.useState(_ => initialState);

  let getDirections = data => {
    switch (formData.traveller) {
    | Person => Js.log2("Person", data)
    | Car => Js.log2("Car", data)
    };
  };

  let getCoordinates = callback => {
    Js.Promise.(
      all([|
        Fetch.fetch(GoogleGeocode.getCoordinates(formData.from))
        |> then_(Fetch.Response.json)
        |> then_(data => data |> GoogleGeocode.fromArray |> resolve),
        Fetch.fetch(GoogleGeocode.getCoordinates(formData.destination))
        |> then_(Fetch.Response.json)
        |> then_(data => data |> GoogleGeocode.fromArray |> resolve),
      |])
      |> then_(data => callback(data) |> resolve)
      |> ignore
    );
  };

  let handleFormSubmit = event => {
    ReactEvent.Synthetic.preventDefault(event);
    getCoordinates(getDirections);
  };

  let handleFormInput = (identifier, value) => {
    switch (identifier) {
    | `From => setFormData(fd => {...fd, from: value})
    | `Destination => setFormData(fd => {...fd, destination: value})
    };
  };

  let handleCheckboxInput = value =>
    setFormData(fd => {...fd, traveller: value ? Car : Person});

  <div
    style={ReactDOMRe.Style.make(
      ~zIndex="1",
      ~position="absolute",
      ~left="12px",
      ~top="12px",
      ~padding="12px",
      ~borderRadius="5px",
      ~background="white",
      (),
    )}>
    <Form handleFormInput handleCheckboxInput handleSubmit=handleFormSubmit />
  </div>;
};