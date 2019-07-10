module Primary = {
  [@react.component]
  let make = (~children, ~type_="button") => {
    <button
      className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold
      py-3 px-4 rounded tracking-wide"
      type_>
      children
    </button>;
  };
};

module Secondary = {
  [@react.component]
  let make = (~children, ~type_="button", ~onClick) => {
    <button
      className="w-full border border-blue-400 hover:border-blue-600
      text-blue-400 hover:text-blue-600 font-semibold py-3 px-4 rounded tracking-wide"
      onClick
      type_>
      children
    </button>;
  };
};
