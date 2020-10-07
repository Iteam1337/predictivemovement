defmodule Engine.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  require Logger
  use Application

  defp apply_event(%BookingRegistered{booking: booking}),
    do: struct(Booking, booking) |> Booking.apply_booking_to_state()

  defp apply_event(%BookingAssigned{booking_id: id, vehicle: vehicle, time_stamp: time}),
    do: Booking.apply_assign_to_state(id, vehicle, time)

  defp apply_event(%BookingPickedUp{booking_id: id, time_stamp: time}),
    do: Booking.apply_event_to_state(id, "picked_up", time)

  defp apply_event(%BookingDelivered{booking_id: id, time_stamp: time}),
    do: Booking.apply_event_to_state(id, "delivered", time)

  defp apply_event(%BookingDeliveryFailed{booking_id: id, time_stamp: time}),
    do: Booking.apply_event_to_state(id, "delivery_failed", time)

  defp apply_event(%VehicleRegistered{vehicle: vehicle}),
    do: struct(Vehicle, vehicle) |> Vehicle.apply_vehicle_to_state()

  defp apply_event(%DriverAcceptedOffer{vehicle_id: vehicle_id, offer: offer}),
    do: Vehicle.apply_offer_accepted(vehicle_id, offer)

  def init_from_eventstore() do
    Logger.info("Restoring Vehicles & Bookings from storage")

    Engine.ES.get_events()
    |> Enum.each(&apply_event/1)

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
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
      {Redix, {Application.fetch_env!(:engine, :redis_url), [name: :redix]}},
      Engine.ES
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Engine.Supervisor]
    proccesses = Supervisor.start_link(children, opts)

    if Application.get_env(:engine, :init_from_eventstore, false), do: init_from_eventstore()
    proccesses
  end
end
