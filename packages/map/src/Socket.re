type t;
[@bs.module "socket.io-client"] external connect: string => t = "connect";

[@bs.send.pipe: t] external _on: (string, string => unit) => unit = "on";
[@bs.send.pipe: t] external _emit: (string, string) => unit = "emit";

let connection = connect(Config.apiHost);

module Event = {
  type t = [ | `RouteMatched | `RouteChangeRequested];

  let toString =
    fun
    | `RouteMatched => "congrats"
    | `RouteChangeRequested => "changeRequested";
};

let emit = (event, payload) => connection |> _emit(event, payload);
let on = (event: Event.t, cb) =>
  connection |> _on(Event.toString(event), cb);
