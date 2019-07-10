module Navigator = {
  type geolocation;

  [@bs.val] [@bs.scope "navigator"]
  external geolocation: geolocation = "geolocation";

  [@bs.deriving {jsConverter: newType}]
  type coords = {
    latitude: float,
    longitude: float,
  };

  [@bs.deriving jsConverter]
  type success = {
    coords: abs_coords,
    timestamp: float,
  };

  [@bs.deriving abstract]
  type options = {enableHighAccuracy: bool};

  [@bs.send]
  external _getCurrentPosition:
    (geolocation, Js.t('a) => unit, Js.t('b) => unit, options) => unit =
    "getCurrentPosition";

  let getCurrentPosition = cb => {
    geolocation->_getCurrentPosition(
      t => {
        let base = successFromJs(t);
        let coords = coordsFromJs(base.coords);

        cb((base, coords));
      },
      err => Js.log2(err##code, err##message),
      options(~enableHighAccuracy=true),
    );
  };
};

[@react.component]
let make = (~handleMove) => {
  let handleClick = _ => {
    Navigator.getCurrentPosition(((_, coords)) => handleMove(coords));
  };

  <button
    className="absolute shadow bg-white w-12 h-12 p-3 z-10 rounded"
    onClick=handleClick
    type_="button"
    style={ReactDOMRe.Style.make(~right="16px", ~bottom="16px", ())}>
    <Icon name=`LocationCurrent />
  </button>;
};
