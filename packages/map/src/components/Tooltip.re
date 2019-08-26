[@react.component]
let make = (~tooltip: ReactMap.IconLayer.hoverInfo) =>
  switch (tooltip._object) {
  | Some(stop) =>
    <div
      style={ReactDOMRe.Style.make(
        ~left=string_of_int(tooltip.x) ++ "px",
        ~top=string_of_int(tooltip.y) ++ "px",
        (),
      )}
      className="absolute bg-gray-700 rounded text-sm text-white
        pointer-events-none px-4 py-3 z-10">
      <div>
        <strong> "Longitude: "->React.string </strong>
        {Js.Float.toFixedWithPrecision(stop.lon, ~digits=2)->React.string}
      </div>
      <div>
        <strong> "Latitude: "->React.string </strong>
        {Js.Float.toFixedWithPrecision(stop.lat, ~digits=2)->React.string}
      </div>
    </div>
  | None => React.null
  };
