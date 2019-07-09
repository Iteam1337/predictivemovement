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
    className="absolute shadow bg-white w-10 h-10 p-3 z-10"
    onClick=handleClick
    type_="button"
    style={ReactDOMRe.Style.make(~right="16px", ~bottom="16px", ())}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="fill-current">
      <path
        d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm2-2.25a8 8 0 0 0 4-2.46V9a2 2 0 0 1-2-2V3.07a7.95 7.95 0 0 0-3-1V3a2 2 0 0 1-2 2v1a2 2 0 0 1-2 2v2h3a2 2 0 0 1 2 2v5.75zm-4 0V15a2 2 0 0 1-2-2v-1h-.5A1.5 1.5 0 0 1 4 10.5V8H2.25A8.01 8.01 0 0 0 8 17.75z"
      />
    </svg>
  </button>;
};
