type t =
  | Error
  | Success;

type style = {
  wrap: string,
  icon: string,
};

module Base = {
  [@react.component]
  let make = (~alertType, ~children, ~title, ~className=?) => {
    let {wrap, icon} =
      switch (alertType) {
      | Error => {
          wrap: "bg-red-100 border-red-500 text-red-900",
          icon: "text-red-500",
        }
      | Success => {
          wrap: "bg-teal-100 border-teal-500 text-teal-900",
          icon: "text-teal-500",
        }
      };

    <div
      className={Cn.make([
        "border-t-4 rounded-b px-4 py-3 shadow-md",
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
          <p className="text-sm"> children </p>
        </div>
      </div>
    </div>;
  };
};

module Success = {
  [@react.component]
  let make = (~className, ~title, ~children) => {
    <Base alertType=Success className title> children </Base>;
  };
};

module Error = {
  [@react.component]
  let make = (~className, ~title, ~children) => {
    <Base alertType=Error className title> children </Base>;
  };
};
