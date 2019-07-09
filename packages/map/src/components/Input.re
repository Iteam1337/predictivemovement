module Text = {
  [@react.component]
  let make =
      (
        ~error: option(Belt.Result.t(Formality.ok, string)),
        ~value,
        ~className=?,
        ~placeholder,
        ~onChange,
      ) => {
    <div>
      <input
        className={Cn.make([
          "block rounded border py-2 px-3 w-full text-gray-700
          appearance-none text-sm",
          switch (error) {
          | Some(Error(_)) => "border-red-500"
          | _ => ""
          },
          className->Cn.unpack,
        ])}
        type_="text"
        placeholder
        onChange
        value
      />
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
