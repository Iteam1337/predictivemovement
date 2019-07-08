type marker =
  | MarkerOpen
  | MarkerClosed;

[@react.component]
let make = (~longitude, ~latitude) => {
  <ReactMap.Marker longitude latitude>
    <div className="w-2 h-2 bg-orange-400 rounded-full" />
  </ReactMap.Marker>;
};
