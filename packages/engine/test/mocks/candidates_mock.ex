defmodule CandidatesMock do
  def find_optimal_routes(_, _),
    do: %{
      copyrights: ["GraphHopper", "OpenStreetMap contributors"],
      job_id: "5eff73a4-5eea-436b-b1bb-eb5be1f8f02c",
      processing_time: 39,
      solution: %{
        completion_time: 3236,
        costs: 236,
        distance: 35762,
        max_operation_time: 3236,
        no_unassigned: 0,
        no_vehicles: 1,
        preparation_time: 0,
        routes: [
          %{
            activities: [
              %{
                address: %{lat: 61.912113, location_id: "974609", lon: 16.270281},
                distance: 0,
                driving_time: 0,
                end_date_time: nil,
                end_time: 0,
                load_after: [0],
                location_id: "974609",
                preparation_time: 0,
                type: "start",
                waiting_time: 0
              },
              %{
                address: %{lat: 61.857838, location_id: "625568", lon: 16.233833},
                arr_date_time: nil,
                arr_time: 1268,
                distance: 13429,
                driving_time: 1268,
                end_date_time: nil,
                end_time: 1268,
                id: "56638",
                load_after: [1],
                load_before: [0],
                location_id: "625568",
                preparation_time: 0,
                type: "pickupShipment",
                waiting_time: 0
              },
              %{
                address: %{lat: 61.87035, location_id: "196232", lon: 15.916928},
                arr_date_time: nil,
                arr_time: 3236,
                distance: 35762,
                driving_time: 3236,
                end_date_time: nil,
                end_time: 3236,
                id: "56638",
                load_after: [0],
                load_before: [1],
                location_id: "196232",
                preparation_time: 0,
                type: "deliverShipment",
                waiting_time: 0
              }
            ],
            completion_time: 3236,
            distance: 35762,
            preparation_time: 0,
            service_duration: 0,
            transport_time: 3236,
            vehicle_id: "19817",
            waiting_time: 0
          }
        ],
        service_duration: 0,
        time: 3236,
        transport_time: 3236,
        unassigned: %{breaks: [], details: [], services: [], shipments: []},
        waiting_time: 0
      },
      status: "finished",
      waiting_time_in_queue: 0
    }
end
