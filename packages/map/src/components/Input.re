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
  open Css;

  let input =
    style([
      height(`px(1)),
      left(`px(-10000)),
      overflow(`hidden),
      position(`absolute),
      top(`zero),
      width(`px(1)),
      selector("&:focus ~ span", [borderColor(`rgb((99, 179, 237)))]),
      selector(
        "&:checked ~ span",
        [
          borderColor(`rgb((99, 179, 237))),
          backgroundColor(`rgb((99, 179, 237))),
          backgroundSize(`size((`percent(75.0), `percent(75.0)))),
          backgroundImage(
            `url(
              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=",
            ),
          ),
          backgroundRepeat(`noRepeat),
          backgroundPosition(`percent(50.0), `percent(50.0)),
        ],
      ),
    ]);

  [@react.component]
  let make = (~checked, ~label, ~onChange) => {
    <label className="text-sm inline-flex items-center">
      <input className=input onChange checked type_="checkbox" />
      <span
        className="w-6 h-6 border border-gray-200 rounded relative inline-block cursor-pointer
      bg-gray-100 mr-4"
      />
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
