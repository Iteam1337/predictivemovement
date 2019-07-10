[@react.component]
let make = (~handleCar) => {
  let url = ReasonReactRouter.useUrl();

  let travelRoute =
    switch (url.path) {
    | ["resa"] => "/"
    | _ => "/resa"
    };

  <div className="absolute min-h-screen shadow-md z-10 flex">
    <nav className="bg-blue-400 px-4 py-8 text-white min-h-screen">
      <div className="mt-12">
        <Router.Link href=travelRoute>
          <Icon className="h-6 w-6" name=`Search />
        </Router.Link>
      </div>
    </nav>
    {switch (url.path) {
     | ["resa"] =>
       <div className="bg-white min-h-screen p-8 w-96">
         <div className="mt-12"> <Travel onCar=handleCar /> </div>
       </div>
     | _ => React.null
     }}
  </div>;
};
