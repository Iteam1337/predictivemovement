type response;

[@bs.module]
external fetch: string => Repromise.t(response) = "isomorphic-fetch";

[@bs.send] external text: response => Repromise.t(string) = "text";

[@bs.send] external json: response => Repromise.t(Js.Json.t) = "json";