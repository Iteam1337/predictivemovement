let statisticsContainer = "flex justify-center items-center";
let icon = "w-4 h-4
          pointer-events-none mr-4";
[@react.component]
let make = (~pendingRoutes: list(API.Car.response), ~onRouteSelect) =>
  <div>
    <p className="font-bold"> "Matchade resor"->React.string </p>
    {switch (Belt.List.length(pendingRoutes)) {
     | 0 =>
       <p className="mt-2">
         {j|Du har inga matchade resor just nu.|j}->React.string
       </p>
     | _ =>
       pendingRoutes
       ->Belt.List.mapWithIndex((i, route) =>
           switch (route.duration, route.distance) {
           | (0.0, 0.0) => React.null
           | (hours, distance) =>
             let duration = TripDetails.Duration.make(hours);

             <div
               key={string_of_int(i)}
               className="flex items-center justify-between mt-2 text-gray-600 text-center
      text-xs"
               onClick={_ => onRouteSelect(route)}>
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
             </div>;
           }
         )
       ->Belt.List.toArray
       ->React.array
     }}
  </div>;
