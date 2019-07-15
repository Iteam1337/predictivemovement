open Jest;
open Expect;

describe("Car", () =>
  test("fromJson", () => {
    let payload =
      {|
  {
    "maxTime": 10.067708333333332,
    "route": {
      "code": "Ok",
      "routes": [
        {
          "geometry": {
            "coordinates": [[17.777747, 59.855984], [17.778107, 59.855574]],
            "type": "LineString"
          },
          "legs": [
            {
              "steps": [],
              "distance": 503340.8,
              "duration": 24162.5,
              "summary": "",
              "weight": 24167.7
            }
          ],
          "distance": 503340.8,
          "duration": 24162.5,
          "weight_name": "routability",
          "weight": 24167.7
        }
      ],
      "waypoints": [
        {
          "hint": "QBAlgEMQJYBIAAAAAAAAAIUAAAAAAAAAK7pHQgAAAAAr_7hCAAAAAEgAAAAAAAAAhQAAAAAAAAB1AQAAU0QPAXBUkQODJg8Bi2qRAwIADxVyolLf",
          "distance": 761.744074,
          "name": "",
          "location": [17.777747, 59.855984]
        },
        {
          "hint": "M5gOgPiYDoAGAAAABwAAAGMAAAAUAAAA5smPQNwwk0CPC4lCv_dbQQYAAAAHAAAAYwAAABQAAAB1AQAABS3-AI65YwO5LP4ARbljAwQAfwdyolLf",
          "distance": 9.357422,
          "name": "",
          "location": [16.657669, 56.867214]
        }
      ]
    },
    "distance": 503340.8,
    "stops": [
      {
        "lat": 59.861643,
        "lon": 17.770115
      },
      {
        "lat": 56.867141,
        "lon": 16.657593
      }
    ],
    "duration": 6.711805555555555,
    "ids": []
  }
      |}
      |> Json.parseOrRaise;
    expect(API.Car.fromJson(payload)) |> toMatchSnapshot;
  })
);
