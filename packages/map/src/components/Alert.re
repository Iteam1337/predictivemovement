type t =
  | Error
  | Success;

type style = {
  wrap: string,
  icon: string,
};

module Base = {
  [@react.component]
  let make =
      (
        ~alertType,
        ~children: option(React.element),
        ~title,
        ~className: option(string),
      ) => {
    let {wrap, icon} =
      switch (alertType) {
      | Error => {wrap: "border-red-500 text-red-900", icon: "text-red-500"}
      | Success => {
          wrap: "border-teal-500 text-teal-900",
          icon: "text-teal-500",
        }
      };

    <div
      className={Cn.make([
        "bg-white border-t-4 rounded px-4 py-3 shadow-md",
        wrap,
        className->Cn.unpack,
      ])}
      role="alert">
      <div className="flex">
        <div className="py-1">
          <Icon
            className={Cn.make(["h-6 w-6 mr-4", icon])}
            name=`Information
          />
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

module Success = {
  [@react.component]
  let make =
      (~className=None, ~title, ~children=None, ~timeout=None, ~onRemove=None) => {
    useTimeout(~timeout, ~onRemove) |> ignore;

    <Base alertType=Success className title> children </Base>;
  };
};

module Error = {
  [@react.component]
  let make =
      (~className=None, ~title, ~children=None, ~timeout=None, ~onRemove=None) => {
    useTimeout(~timeout, ~onRemove) |> ignore;

    <Base alertType=Error className title> children </Base>;
  };
};
