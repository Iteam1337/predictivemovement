type t =
  | Error
  | Success;

type style = {
  wrap: string,
  icon: string,
};

let useTimeout = (~timeout, ~onRemove) => {
  React.useEffect2(
    () => {
      let id =
        switch (timeout, onRemove) {
        | (Some(t), Some(fn)) => Some(Js.Global.setTimeout(fn, t))
        | _ => None
        };

      Some(
        () =>
          switch (id) {
          | Some(id) => Js.Global.clearTimeout(id)
          | None => ()
          },
      );
    },
    (timeout, onRemove),
  );
};

module Base = {
  [@react.component]
  let make =
      (
        ~alertType,
        ~children: option(React.element),
        ~title,
        ~className: option(string),
        ~onClick: option(unit => unit),
        ~timeout,
        ~onRemove,
      ) => {
    useTimeout(~timeout, ~onRemove) |> ignore;

    let wrap =
      switch (alertType, onClick) {
      | (Error, _) => "border-red-500 text-red-900"
      | (Success, None) => "border-teal-500 text-teal-900"
      | (Success, Some(_)) => "border-teal-500 text-teal-900 hover:text-white hover:bg-teal-500 cursor-pointer"
      };

    <div
      className={Cn.make([
        "bg-white border-t-4 rounded px-4 py-3 shadow-md",
        wrap,
        className->Cn.unpack,
      ])}
      onClick={_ =>
        switch (onClick) {
        | None => ()
        | Some(fn) =>
          fn();

          switch (onRemove) {
          | None => ()
          | Some(onRemove) => onRemove()
          };
        }
      }
      role="alert">
      <div
        className={Cn.make([
          "flex",
          Belt.Option.isNone(children) ? "items-center" : "",
        ])}>
        <div className="py-1">
          <Icon className="h-6 w-6 mr-4" name=`Information />
        </div>
        <div>
          <p className="font-bold"> title->React.string </p>
          {switch (children) {
           | None => React.null
           | Some(children) => <p className="text-sm"> children </p>
           }}
        </div>
      </div>
    </div>;
  };
};

module Success = {
  [@react.component]
  let make =
      (
        ~className=None,
        ~title,
        ~onClick=None,
        ~children=None,
        ~timeout=None,
        ~onRemove=None,
      ) => {
    <Base alertType=Success className title onClick onRemove timeout>
      children
    </Base>;
  };
};

module Error = {
  [@react.component]
  let make =
      (
        ~className=None,
        ~title,
        ~onClick=None,
        ~children=None,
        ~timeout=None,
        ~onRemove=None,
      ) => {
    <Base alertType=Error className title onClick onRemove timeout>
      children
    </Base>;
  };
};
