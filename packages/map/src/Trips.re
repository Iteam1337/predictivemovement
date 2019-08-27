let statisticsContainer = "flex justify-center items-center";

let icon = "w-4 h-4
          pointer-events-none mr-4";

[@react.component]
let make =
    (
      ~acceptedRoutes: list(API.Car.routeWithId),
      ~pendingRoutes: list(API.Car.routeWithId),
      ~onRouteSelect,
      ~onRouteAnswer,
    ) => {
  <div>
    <div className="mb-12">
      <p className="font-bold mb-5"> {j|Accepterade resor|j}->React.string </p>
      {switch (Belt.List.length(acceptedRoutes)) {
       | 0 =>
         <p className="mt-2">
           {j|Du har inga accepterade samresor just nu.|j}->React.string
         </p>
       | _ =>
         acceptedRoutes
         ->Belt.List.map(response => {
             let {API.Car.response: route, id} = response;

             switch (route.duration, route.distance) {
             | (0.0, 0.0) => React.null
             | (hours, distance) =>
               let duration = TripDetails.Duration.make(hours);
               <div
                 key=id
                 className={Cn.make([
                   "flex flex-col items-stretch justify-between mt-2 text-gray-600 text-center
      text-xs border-b border-gray-200 pb-4 mb-4",
                   Css.(style([lastChild([borderWidth(`px(0))])])),
                 ])}>
                 <div
                   onClick={_ => onRouteSelect(route)}
                   className="flex items-center justify-between mt-2">
                   <div className=statisticsContainer>
                     <Icon className=icon name=`Time />
                     {duration |> React.string}
                   </div>
                   <div className=statisticsContainer>
                     <Icon className=icon name=`Travel />
                     {TripDetails.Distance.make(distance) |> React.string}
                   </div>
                   <div className=statisticsContainer>
                     <Icon className=icon name=`Shuffle />
                     {route.stops->Belt.Array.length->string_of_int
                      ++ " stopp"
                      |> React.string}
                   </div>
                 </div>
               </div>;
             };
           })
         ->Belt.List.toArray
         ->React.array
       }}
    </div>
    <div className="mb-12">
      <p className="font-bold mb-5"> {j|Samreseförslag|j}->React.string </p>
      {switch (Belt.List.length(pendingRoutes)) {
       | 0 =>
         <p className="mt-2">
           {j|Du har inga matchande resor just nu.|j}->React.string
         </p>
       | _ =>
         pendingRoutes
         ->Belt.List.map(response => {
             let {API.Car.response: route, id} = response;

             switch (route.duration, route.distance) {
             | (0.0, 0.0) => React.null
             | (hours, distance) =>
               let duration = TripDetails.Duration.make(hours);
               <div key=id>
                 <div
                   className={Cn.make([
                     "flex flex-col items-stretch justify-between mt-2 text-gray-600 text-center
      text-xs border-b border-gray-200 pb-4 mb-4",
                     Css.(style([lastChild([borderWidth(`px(0))])])),
                   ])}>
                   <div
                     onClick={_ => onRouteSelect(route)}
                     className="flex items-center justify-between mt-2">
                     <div className=statisticsContainer>
                       <Icon className=icon name=`Time />
                       {duration |> React.string}
                     </div>
                     <div className=statisticsContainer>
                       <Icon className=icon name=`Travel />
                       {TripDetails.Distance.make(distance) |> React.string}
                     </div>
                     <div className=statisticsContainer>
                       <Icon className=icon name=`Shuffle />
                       {route.stops->Belt.Array.length->string_of_int
                        ++ " stopp"
                        |> React.string}
                     </div>
                   </div>
                   <div className="flex justify-between items-evenly mt-2">
                     <div className="mr-2 w-full">
                       <Button.Primary
                         type_="submit"
                         onClick={_ => onRouteAnswer(response)}>
                         "Acceptera"->React.string
                       </Button.Primary>
                     </div>
                     <Button.Secondary onClick={_ => Js.log("Deny")}>
                       "Neka"->React.string
                     </Button.Secondary>
                   </div>
                 </div>
               </div>;
             };
           })
         ->Belt.List.toArray
         ->React.array
       }}
    </div>
  </div>;
};