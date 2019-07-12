[@react.component]
let make = (~pendingRoutes: list(API.Car.response)) =>
  <div>
    <p className="font-bold"> "Matchade resor"->React.string </p>
    {pendingRoutes
     ->Belt.List.map(route =>
         switch (route.duration, route.distance) {
         | (0.0, 0.0) => React.null
         | (hours, distance) =>
           /* let (originTime, destinationTime) = TripDetails.Date.make(hours); */
           let duration = TripDetails.Duration.make(hours);

           <div
             className="flex items-center justify-between mt-2 text-gray-600 text-center
      text-sm">
             <div> {duration |> React.string} </div>
             <div>
               {TripDetails.Distance.make(distance) |> React.string}
             </div>
             <div>
               {route.stops->Belt.Array.length->string_of_int
                ++ " stopp"
                |> React.string}
             </div>
           </div>;
         }
       )
     ->Belt.List.toArray
     ->React.array}
  </div>;
