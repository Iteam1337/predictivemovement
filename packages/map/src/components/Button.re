module Primary = {
  [@react.component]
  let make = (~children, ~type_) => {
    <button
      className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold
      py-3 px-4 rounded tracking-wide"
      type_>
      children
    </button>;
  };
};
