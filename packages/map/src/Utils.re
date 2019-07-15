module UUID: {
  type t;
  let toString: t => string;
  let make: unit => t;
} = {
  type t = string;

  [@bs.module] external make: unit => t = "uuid/v4";

  let toString = id => id;
};

let invokeIfSet = (~callback, data) =>
  switch (callback) {
  | Some(cb) => cb(data)
  | None => ()
  };
