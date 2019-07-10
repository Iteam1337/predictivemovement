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
  let geolocation = React.useContext(Geolocation.context);

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
            switch (
              geolocation.myLocation,
              Belt.List.getExn(data, 0),
              Belt.List.getExn(data, 1),
            ) {
            | (Some(_), Ok(start), Ok(destination))
            | (None, Ok(start), Ok(destination)) =>
              makeBody(start, destination)
              |> (
                switch (state.traveller) {
                | Person => postPerson
                | Car => postCar
                }
              )
            | (
                Some({latitude, longitude}),
                Error(`ZeroResults),
                Ok(destination),
              ) =>
              makeBody(GoogleGeocode.make(latitude, longitude), destination)
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

  React.useEffect1(
    () => {
      switch (geolocation.myLocation) {
      | None => ()
      | Some(_) =>
        form.change(
          Origin,
          TravelForm.OriginField.update(form.state, "Min position"),
        )
      };

      None;
    },
    [|geolocation.myLocation|],
  );

  let handleChange = (field, fieldUpdater, event) => {
    form.change(
      field,
      fieldUpdater(form.state, event->ReactEvent.Form.target##value),
    );
  };

  let handleCalendar = (field, fieldUpdater, value) => {
    form.change(
      field,
      fieldUpdater(form.state, Intl.Date.make(~date=value, ())),
    );
  };

  let handleCheckbox = (field, fieldUpdater, event) => {
    form.change(
      field,
      fieldUpdater(form.state, event->ReactEvent.Form.target##checked),
    );
  };

  <form onSubmit={form.submit->Formality.Dom.preventDefault}>
    <Input.Calendar
      error={StartDate->(form.result)}
      id="travel-date-start"
      label="Resans startdatum"
      placeholder="Startdatum"
      onChange={handleCalendar(StartDate, TravelForm.StartDateField.update)}
    />
    <Input.Text
      className="mt-4"
      error={Origin->(form.result)}
      icon=`Location
      id="travel-origin"
      label="Startpunkt"
      placeholder="Startadress"
      onChange={handleChange(Origin, TravelForm.OriginField.update)}
      value={form.state.origin}
    />
    <div className="mt-8">
      <Input.Calendar
        error={EndDate->(form.result)}
        id="travel-date-end"
        label="Resans slutdatum"
        placeholder="Slutdatum"
        onChange={handleCalendar(EndDate, TravelForm.EndDateField.update)}
      />
      <Input.Text
        className="mt-4"
        error={Destination->(form.result)}
        icon=`Location
        id="travel-destination"
        label="Destination"
        placeholder="Slutadress"
        onChange={handleChange(
          Destination,
          TravelForm.DestinationField.update,
        )}
        value={form.state.destination}
      />
    </div>
    <div className="mt-8">
      <Input.Checkbox
        checked={form.state.traveller === Car}
        label="Jag har bil"
        onChange={handleCheckbox(Traveller, TravelForm.TravellerField.update)}
      />
    </div>
    <div className="mt-8">
      <Button.Primary type_="submit">
        {React.string("Skicka")}
      </Button.Primary>
    </div>
  </form>;
};
