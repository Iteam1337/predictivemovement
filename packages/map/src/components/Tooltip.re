[@react.component]
let make = (~tooltip: Map.IconLayer.hoverInfo) =>
  switch (tooltip._object) {
  | Some(stop) =>
    <div
      style={ReactDOMRe.Style.make(
        ~left=string_of_int(tooltip.x) ++ "px",
        ~top=string_of_int(tooltip.y) ++ "px",
        (),
      )}
      className="absolute bg-gray-800 flex flex-col rounded text-sm text-white pointer-events-none p-2 z-10">
      <p> {("Longitude: " ++ Js.Float.toString(stop.lon))->React.string} </p>
      <p> {("Latitude: " ++ Js.Float.toString(stop.lat))->React.string} </p>
    </div>
  | None => React.null
  };
