module Style = {
  open Css;

  let input =
    merge([
      "block bg-gray-100 rounded px-4 py-3 pl-12 w-full text-gray-700
          appearance-none text-sm font-semibold",
    ]);
};

module Text = {
  [@react.component]
  let make =
      (
        ~error: option(Belt.Result.t(Formality.ok, string)),
        ~value,
        ~className=?,
        ~placeholder,
        ~onChange,
        ~id,
        ~label,
        ~icon=`Calendar,
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
          type_="text"
          placeholder
          onChange
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
