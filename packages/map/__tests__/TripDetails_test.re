open Jest;
open Expect;
open TripDetails;

describe("Distance", () => {
  test("splits by miles", () =>
    expect(Distance.make(78912.4)) |> toEqual("7.89 mil")
  );

  test("splits by kilometer", () =>
    expect(Distance.make(9235.3)) |> toEqual("9.24 km")
  );

  test("displays meters", () =>
    expect(Distance.make(562.10)) |> toEqual("562 m")
  );
});

describe("Duration", () => {
  test("handles minutes", () =>
    expect(Duration.make(0.58)) |> toEqual("35 min")
  );

  test("handles hours", () =>
    expect(Duration.make(4.98)) |> toEqual("4 h 59 min")
  );
});
