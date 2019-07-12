[@react.component]
let make = () => {
  let url = ReasonReactRouter.useUrl();

  let travelRoute =
    switch (url.path) {
    | ["resa"] => "/"
    | _ => "/resa"
    };

  let sideBar = (~show) => {
    let hidden =
      Css.(
        style([
          transform(translateX(pct(show ? 0.0 : (-100.0)))),
          transition(~duration=200, "transform"),
        ])
      );

    Cn.(make(["bg-white min-h-screen p-8 w-96 shadow-md", hidden]));
  };

  <div className="absolute min-h-screen  z-10 flex">
    <nav className="bg-blue-400 px-4 py-8 text-white min-h-screen z-10">
      <div className="mt-12">
        <Router.Link href=travelRoute>
          <Icon className="h-6 w-6" name=`Search />
        </Router.Link>
      </div>
    </nav>
    {switch (url.path) {
     | ["resa"] =>
       <div className={sideBar(~show=true)}>
         <div className="mt-12"> <Travel /> </div>
       </div>
     | _ => <div className={sideBar(~show=false)} />
     }}
  </div>;
};