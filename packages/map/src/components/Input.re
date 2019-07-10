module Style = {
  open Css;

  let input =
    merge([
      "block bg-gray-100 rounded px-4 py-3 pl-12 w-full text-gray-700
          appearance-none text-sm font-semibold",
    ]);
};

module Text = {
  let invokeIfSet = (~callback, data) =>
    switch (callback) {
    | Some(cb) => cb(data)
    | None => ()
    };

  [@react.component]
  let make =
      (
        ~className=?,
        ~error: option(Belt.Result.t(Formality.ok, string)),
        ~icon=`Calendar,
        ~id,
        ~label,
        ~onChange=?,
        ~onFocus=?,
        ~placeholder,
        ~readOnly=false,
        ~value,
      ) => {
    <div className={className->Cn.unpack}>
      <label className="font-bold text-sm mb-2 block" htmlFor=id>
        label->React.string
      </label>
      <div className="relative">
        <Icon
          className="absolute top-1/2 left-4 translate-y--1/2 w-4 h-4
          pointer-events-none"
          name=icon
        />
        <input
          className=Style.input
          id
          onChange={invokeIfSet(~callback=onChange)}
          onFocus={invokeIfSet(~callback=onFocus)}
          placeholder
          readOnly
          type_="text"
          value
        />
      </div>
      {switch (error) {
       | Some(Error(message)) =>
         <div className="text-red-500 mt-2 text-xs">
           message->React.string
         </div>
       | Some(Ok(Valid))
       | Some(Ok(NoValue))
       | None => React.null
       }}
    </div>;
  };
};

module Checkbox = {
  [@react.component]
  let make = (~checked, ~label, ~onChange) => {
    <label className="text-sm">
      <input className="mr-2" onChange checked type_="checkbox" />
      label->React.string
    </label>;
  };
};

module Calendar = {
  type calendarState = [ | `CalendarOpen | `CalendarClosed];

  type state = {
    date: string,
    calendarState,
  };

  type action =
    | DisplayCalendar(calendarState)
    | SetDate(Js.Date.t);

  module ReactCalendar = {
    [@bs.module "react-calendar"] [@react.component]
    external make:
      (~onChange: Js.Date.t => unit, ~value: Js.Date.t) => React.element =
      "default";
  };

  [@react.component]
  let make = (~onChange, ~error, ~id, ~label, ~placeholder) => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | DisplayCalendar(calendarState) => {...state, calendarState}
          | SetDate(date) => {
              calendarState: `CalendarClosed,
              date: Intl.Date.make(~date, ()),
            }
          },
        {date: Intl.Date.make(), calendarState: `CalendarClosed},
      );

    <div className="relative">
      <Text
        id
        placeholder
        value={state.date}
        icon=`Calendar
        readOnly=true
        error
        label
        onFocus={_ => dispatch(DisplayCalendar(`CalendarOpen))}
      />
      {switch (state.calendarState) {
       | `CalendarClosed => React.null
       | `CalendarOpen =>
         <>
           <div
             className="fixed inset-0 z-10"
             onClick={_ => dispatch(DisplayCalendar(`CalendarClosed))}
           />
           <div
             className="absolute bottom-10 border-transparent left-0 right-0 mb-4 rounded shadow z-20">
             <ReactCalendar
               onChange={date => {
                 onChange(date);
                 dispatch(SetDate(date));
               }}
               value={state.date |> Js.Date.fromString}
             />
           </div>
         </>
       }}
    </div>;
  };
};
