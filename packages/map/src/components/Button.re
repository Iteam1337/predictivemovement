module Primary = {
  [@react.component]
  let make = (~children, ~type_) => {
    <button
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      type_>
      children
    </button>;
  };
};
