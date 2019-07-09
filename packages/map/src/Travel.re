type traveller =
  | Car
  | Person;

type t = {
  date: string,
  from: string,
  destination: string,
  traveller,
};

module TravelForm = {
  open Formality;

  type field =
    | StartDate
    | EndDate
    | Traveller
    | Origin
    | Destination;

  type state = {
    startDate: string,
    endDate: string,
    traveller,
    origin: string,
    destination: string,
  };

  type message = string;
  type submissionError = unit;

  module StartDateField = {
    let update = (state, startDate) => {...state, startDate};
  };

  module EndDateField = {
    let update = (state, endDate) => {...state, endDate};
  };

  module TravellerField = {
    let update = (state, traveller) => {
      ...state,
      traveller: traveller ? Car : Person,
    };
  };

  module OriginField = {
    let update = (state, origin) => {...state, origin};

    let validator = {
      field: Origin,
      strategy: Strategy.OnFirstSuccessOrFirstBlur,
      dependents: None,
      validate: ({origin}) => {
        switch (origin) {
        | "" => Error({j|Startadress är obligatorisk|j})
        | _ => Ok(Valid)
        };
      },
    };
  };

  module DestinationField = {
    let update = (state, destination) => {...state, destination};

    let validator = {
      field: Destination,
      strategy: Strategy.OnFirstSuccessOrFirstBlur,
      dependents: None,
      validate: ({destination}) => {
        switch (destination) {
        | "" => Error({j|Slutadress är obligatorisk|j})
        | _ => Ok(Valid)
        };
      },
    };
  };

  let validators = [OriginField.validator, DestinationField.validator];
};

module TravelFormHook = Formality.Make(TravelForm);

[@react.component]
let make = (~onCar) => {
  let form =
    TravelFormHook.useForm(
      ~initialState={
        startDate: Intl.Date.make(),
        endDate: Intl.Date.make(),
        traveller: Person,
        origin: "",
        destination: "",
      },
      ~onSubmit=(state, form) => {
        let makeBody = (origin, destination) => {
          Json.Encode.(
            object_([
              (
                "start",
                object_([
                  ("date", string(state.startDate)),
                  ("position", GoogleGeocode.toJson(origin)),
                ]),
              ),
              (
                "end",
                object_([
                  ("date", string(state.endDate)),
                  ("position", GoogleGeocode.toJson(destination)),
                ]),
              ),
            ])
          );
        };

        let postPerson = body => {
          API.Travel.make(~route=`Person, ~body, ())
          |> Repromise.wait(
               fun
               | Belt.Result.Ok(_) => form.notifyOnSuccess(None)
               | Belt.Result.Error(_) => (),
             );
        };

        let postCar = body => {
          API.Travel.make(~route=`Car, ~body, ())
          |> Repromise.wait(
               fun
               | Belt.Result.Ok(data) => {
                   onCar(data |> API.Car.fromJson);
                   form.notifyOnSuccess(None);
                 }
               | Belt.Result.Error(e) => Js.log2("Error", e),
             );
        };

        let callback = data => {
          Belt.Result.(
            switch (Belt.List.getExn(data, 0), Belt.List.getExn(data, 1)) {
            | (Ok(start), Ok(destination)) =>
              makeBody(start, destination)
              |> (
                switch (state.traveller) {
                | Person => postPerson
                | Car => postCar
                }
              )
            | _ => Js.log("Error while getting coordinates")
            }
          );
        };

        Repromise.(
          [state.origin, state.destination]
          ->Belt.List.map(address =>
              Refetch.fetch(GoogleGeocode.getCoordinates(address))
              |> andThen(Refetch.json)
              |> map(GoogleGeocode.fromArray)
            )
          |> all
          |> wait(callback)
        );

        form.notifyOnSuccess(None);
      },
    );

  let handleChange = (field, fieldUpdater, event) => {
    form.change(
      field,
      fieldUpdater(form.state, event->ReactEvent.Form.target##value),
    );
  };

  let handleCheckbox = (field, fieldUpdater, event) => {
    form.change(
      field,
      fieldUpdater(form.state, event->ReactEvent.Form.target##checked),
    );
  };

  <form onSubmit={form.submit->Formality.Dom.preventDefault}>
    <Input.Text
      error={StartDate->(form.result)}
      placeholder="Startdatum"
      onChange={handleChange(StartDate, TravelForm.StartDateField.update)}
      value={form.state.startDate}
    />
    <Input.Text
      error={Origin->(form.result)}
      className="mt-2"
      placeholder="Startadress"
      onChange={handleChange(Origin, TravelForm.OriginField.update)}
      value={form.state.origin}
    />
    <Input.Text
      error={EndDate->(form.result)}
      className="mt-2"
      placeholder="Slutdatum"
      onChange={handleChange(EndDate, TravelForm.EndDateField.update)}
      value={form.state.endDate}
    />
    <Input.Text
      error={Destination->(form.result)}
      className="mt-2"
      placeholder="Slutadress"
      onChange={handleChange(Destination, TravelForm.DestinationField.update)}
      value={form.state.destination}
    />
    <div className="mt-2">
      <Input.Checkbox
        checked={form.state.traveller === Car}
        label="Jag har bil"
        onChange={handleCheckbox(Traveller, TravelForm.TravellerField.update)}
      />
    </div>
    <div className="mt-4">
      <Button.Primary type_="submit">
        {React.string("Skicka")}
      </Button.Primary>
    </div>
  </form>;
};
