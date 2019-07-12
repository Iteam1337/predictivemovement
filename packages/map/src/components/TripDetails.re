type hoverState =
  | NotHovering
  | Hovering;

type state = {hoverState};

type action =
  | HoverState(hoverState);

module Distance = {
  let fromDistance = distance =>
    switch (distance) {
    | d when d >= 10000.0 => `ScandinavianMile
    | d when d >= 1000.0 => `Kilometers
    | _ => `Meters
    };

  let distanceUnit = (distance, value) =>
    switch (distance) {
    | `ScandinavianMile => {j|$value mil|j}
    | `Kilometers => {j|$value km|j}
    | `Meters => {j|$value m|j}
    };

  let toPrecision = (unitType, value) =>
    value
    |> Js.Float.toFixedWithPrecision(~digits=2)
    |> distanceUnit(unitType);

  let make = distance =>
    switch (fromDistance(distance)) {
    | `ScandinavianMile as t => distance /. 10000.0 |> toPrecision(t)
    | `Kilometers as t => distance /. 1000.0 |> toPrecision(t)
    | `Meters as t =>
      distance |> Js.Math.round |> Js.Float.toString |> distanceUnit(t)
    };
};

module Duration = {
  let fromDuration = duration =>
    switch (duration) {
    | d when d >= 1.0 => `Hours
    | _ => `Minutes
    };

  let durationUnit = (duration, value) =>
    switch (duration) {
    | `Hours => {j|$value h|j}
    | `Minutes => {j|$value min|j}
    };

  let make = duration =>
    switch (fromDuration(duration)) {
    | `Hours as t =>
      let hours = duration |> Js.Math.floor;
      let minutes = mod_float(duration, 1.0) *. 60.0 |> Js.Math.round;

      durationUnit(t, hours) ++ " " ++ durationUnit(`Minutes, minutes);
    | `Minutes as t =>
      duration
      *. 60.0
      |> Js.Math.round
      |> Js.Float.toString
      |> durationUnit(t)
    };
};

module Date = {
  let now = Js.Date.make();

  let options =
    Intl.Date.(
      Some(
        options(
          ~hour=yearDayToJs(`numeric),
          ~minute=yearDayToJs(`numeric),
          ~hour12=false,
          (),
        ),
      )
    );

  let originTime = Intl.Date.make(~date=now, ~options, ());

  let destinationTime = hours => {
    Intl.Date.make(
      ~date=now |> DateFns.addMinutes(hours *. 60.0 |> Js.Math.round),
      ~options,
      (),
    );
  };

  let make = hours => (originTime, destinationTime(hours));
};

[@react.component]
let make = (~car, ~flyToRoute) => {
  let {duration, distance, stops, route: {waypoints}}: API.Car.response = car;
  let (state, dispatch) =
    React.useReducer(
      (_state, action) =>
        switch (action) {
        | HoverState(hoverState) => {hoverState: hoverState}
        },
      {hoverState: NotHovering},
    );

  switch (duration, distance) {
  | (0.0, 0.0) => React.null
  | (hours, distance) =>
    let (originTime, destinationTime) = Date.make(hours);
    let duration = Duration.make(hours);

    <div
      className="w-64 translate-x--1/2 border-t-4 border-blue-400 bg-white
    absolute bottom-4 z-10 rounded left-1/2 shadow-md"
      onMouseOver={_ => dispatch(HoverState(Hovering))}
      onMouseLeave={_ => dispatch(HoverState(NotHovering))}
      onClick={_ => flyToRoute(waypoints)}>
      {switch (state.hoverState) {
       | Hovering =>
         <div
           className="flex cursor-pointer items-center justify-center bg-blue-400 text-white
         py-6 cursor-pointer">
           "Tillbaka till rutten"->React.string
         </div>
       | NotHovering =>
         <div className="p-4">
           <div className="flex items-center justify-between">
             <div className="text-lg font-bold">
               originTime->React.string
             </div>
             <div className="flex items-center">
               <div className="h-1 w-1 bg-gray-200 rounded-full" />
               <div className="h-2 w-2 mx-2 bg-gray-200 rounded-full" />
               <div className="h-1 w-1 bg-gray-200 rounded-full" />
             </div>
             <div className="text-lg font-bold">
               destinationTime->React.string
             </div>
           </div>
           <div
             className="flex items-center justify-between mt-2 text-gray-600 text-center
      text-sm">
             <div> {duration |> React.string} </div>
             <div> {Distance.make(distance) |> React.string} </div>
             <div>
               {stops->Belt.Array.length->string_of_int
                ++ " stopp"
                |> React.string}
             </div>
           </div>
         </div>
       }}
    </div>;
  };
};
