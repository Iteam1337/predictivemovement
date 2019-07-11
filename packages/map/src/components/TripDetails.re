type hoverState =
  | NotHovering
  | Hovering;

type state = {hoverState};

type action =
  | HoverState(hoverState);

module Distance = {
  let distanceUnit = distance =>
    switch (distance) {
    | d when d >= 1000.0 => "km"
    | _ => "m"
    };

  let make = distance =>
    (
      switch (distance) {
      | d when d >= 1000.0 => d /. 1000.0
      | d => d
      }
    )
    |> Js.Float.toFixedWithPrecision(~digits=2)
    |> (d => d ++ " " ++ distanceUnit(distance));
};

module Duration = {
  let make = duration =>
    duration *. 60.0 |> Js.Math.round |> Js.Float.toString;
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

  let destinationTime = minutes => {
    Intl.Date.make(
      ~date=now |> DateFns.addMinutes(minutes->Js.Float.fromString),
      ~options,
      (),
    );
  };

  let make = minutes => (originTime, destinationTime(minutes));
};

[@react.component]
let make = (~duration, ~distance, ~stops, ~flyToRoute, ~waypoints) => {
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
  | (duration, distance) =>
    let minutes = Duration.make(duration);
    let (originTime, destinationTime) = Date.make(minutes);

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
             <div> {minutes ++ " min" |> React.string} </div>
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
