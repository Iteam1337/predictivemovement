module Text = {
  [@react.component]
  let make = (~className=?, ~placeholder, ~onChange) => {
    <input
      className={Cn.make([
        "block rounded border py-2 px-3 w-full text-gray-700
        appearance-none",
        className->Cn.unpack,
      ])}
      type_="text"
      placeholder
      onChange
    />;
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
