type marker =
  | MarkerOpen
  | MarkerClosed;

[@react.component]
let make = (~location) => {
  let (longitude, latitude) = Location.make(location);
  let (marker, setMarker) = React.useState(() => MarkerClosed);

  <ReactMap.Marker longitude latitude>
    <div
      className="w-2 h-2 bg-orange-400 rounded-full"
      onClick={_ =>
        setMarker(marker =>
          marker === MarkerClosed ? MarkerOpen : MarkerClosed
        )
      }
    />
    {switch (marker) {
     | MarkerOpen =>
       <div className="rounded p-4 bg-white">
         {location->Location.toName->React.string}
       </div>
     | MarkerClosed => React.null
     }}
  </ReactMap.Marker>;
};
