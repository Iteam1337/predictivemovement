defmodule Engine.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  require Logger
  use Application

  def init_from_storage() do
    Logger.info("Restoring Vehicles & Bookings from storage")
    booking_ids = Engine.RedisAdapter.get_bookings() |> Enum.map(&Booking.make/1)

    vehicle_ids =
      Engine.RedisAdapter.get_vehicles() |> Enum.map(&Vehicle.make(&1, added_from_restore: true))

    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
  end

  def start(_type, _args) do
    children = [
      Engine.BookingProcessor,
      PlanStore,
      Engine.AdminProcessor,
      Engine.BookingUpdatesProcessor,
      Engine.BookingDeleteProcessor,
      Engine.VehicleDeleteProcessor,
      Engine.BookingStore,
      Engine.VehicleStore,
      {Redix, {Application.fetch_env!(:engine, :redis_url), [name: :redix]}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Engine.Supervisor]
    proccesses = Supervisor.start_link(children, opts)

    if Application.get_env(:engine, :init_from_storage, false), do: init_from_storage()
    proccesses
  end
end
