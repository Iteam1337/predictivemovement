module Primary = {
  [@react.component]
  let make = (~children, ~onClick=?, ~type_="button", ~className=?) => {
    <button
      className={Cn.make([
        "w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold
        py-3 px-4 rounded tracking-wide border border-blue-400 hover:border-blue-600",
        className->Cn.unpack,
      ])}
      type_
      onClick={Utils.invokeIfSet(~callback=onClick)}>
      children
    </button>;
  };
};

module Secondary = {
  [@react.component]
  let make =
      (~children, ~type_="button", ~onClick, ~disabled=false, ~className=?) => {
    let className =
      Cn.make([
        "w-full border font-semibold py-3 px-4 rounded tracking-wide",
        className->Cn.unpack,
        switch (disabled) {
        | false => "border-blue-400 hover:border-blue-600 text-blue-400 hover:text-blue-600 bg-white"
        | true => "cursor-not-allowed border-gray-600 hover:border-gray-600 text-gray-600 opacity-50"
        },
      ]);

    <button className onClick type_> children </button>;
  };
};