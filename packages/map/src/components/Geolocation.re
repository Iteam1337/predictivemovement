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
  let (isActive, setIsActive) = React.useState(() => false);

  let handleClick = _ => {
    Navigator.getCurrentPosition(((_, coords)) => handleMove(coords));
    setIsActive(_ => true);
  };

  <button
    className={Cn.make([
      "absolute shadow bg-white w-12 h-12 p-3 z-10 rounded",
      "text-blue-400"->Cn.ifTrue(isActive),
    ])}
    onClick=handleClick
    type_="button"
    style={ReactDOMRe.Style.make(~right="16px", ~bottom="16px", ())}>
    <Icon name=`LocationCurrent />
  </button>;
};

module Marker = {
  [@react.component]
  let make = (~longitude, ~latitude) => {
    let shadow = `rgba((43, 108, 176, 100.0));
    let x = `zero;
    let y = `zero;

    let initialShadow = Css.(boxShadow(~x, ~y, ~blur=`px(8), shadow));

    let pulse =
      Css.(
        keyframes([
          (0, [initialShadow]),
          (50, [boxShadow(~x, ~y, ~blur=`px(16), shadow)]),
          (100, [initialShadow]),
        ])
      );

    let className =
      Css.(
        merge([
          "rounded-full bg-blue-400 w-5 h-5 border-white",
          style([
            animationName(pulse),
            animationDuration(2000),
            animationIterationCount(`infinite),
            borderWidth(`px(3)),
            initialShadow,
          ]),
        ])
      );

    <ReactMap.Marker longitude latitude> <div className /> </ReactMap.Marker>;
  };
};

module Context = {
  type t = {myLocation: option(Navigator.coords)};

  include ReactContext.Make({
    type context = t;
    let defaultValue = {myLocation: None};
  });
};
