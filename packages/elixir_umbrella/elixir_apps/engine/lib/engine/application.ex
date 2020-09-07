defmodule Engine.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def init_from_storage() do
    bookings = [%{
      assigned_to: nil,
      delivery: %{lat: 61.797135, lon: 16.210047},
      events: [],
      external_id: 76143,
      id: "pmb-2nT716IA",
      metadata: %{},
      pickup: %{lat: 61.919177, lon: 15.849271},
      size: %{measurements: [105, 55, 26], weight: 13.7}
    }]
    vehicles = [%{
      activities: nil,
      booking_ids: nil,
      busy: nil,
      capacity: %{volume: 15, weight: 700},
      current_route: nil,
      earliest_start: nil,
      end_address: %{lat: 61.786296, lon: 16.014863},
      id: "pmv-6Do3L4JX",
      latest_end: nil,
      metadata: %{},
      profile: nil,
      start_address: %{lat: 61.786296, lon: 16.014863}
    }]

    booking_ids = bookings |> Enum.map(&Booking.make/1)
    vehicle_ids = vehicles |> Enum.map(&Vehicle.make/1)

    Engine.BookingProcessor.calculate_plan()
  end

  def start(_type, _args) do
    children = [
      Engine.BookingProcessor,
      PlanStore,
      Engine.AdminProcessor,
      Engine.BookingUpdatesProcessor,
      Engine.BookingStore,
      Engine.VehicleStore,
      {Redix, {"redis://localhost:6379", [name: :redix]}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Engine.Supervisor]
    proccesses = Supervisor.start_link(children, opts)
    init_from_storage()
    proccesses
  end
end
