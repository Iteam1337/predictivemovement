[@react.component]
let make = (~details) => {
  Js.log(details->List.length - 1);
  switch (details->List.length - 1) {
  | 0 =>
    <div className="mt-5 p-2 bg-white rounded">
      {j|Föraren kör ensam|j}->React.string
    </div>
  | v when v > 0 =>
    let passengers = string_of_int(v);
    <div className="mt-5 p-2 bg-white  rounded">
      {j|$passengers personer kunde lämna bilen hemma.|j}->React.string
    </div>;
  | _ => React.null
  };
};