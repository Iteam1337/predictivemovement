defmodule VehicleTest do
  alias MessageGenerator.TransportGenerator
  use ExUnit.Case
  import Mox

  setup do
    Engine.Adapters.MockRMQ
    |> stub(:publish, fn data, _, _ -> data end)
    |> stub(:publish, fn data, _ -> data end)

    :ok
  end

  test "it allows vehicle creation" do
    result =
      TransportGenerator.generate_transport_props()
      |> Vehicle.make()

    assert is_binary(result)
  end

  test "required start address" do
    result =
      %{
        id: 87147
      }
      |> Vehicle.make()

    assert result == [
             {:error, :start_address, :presence, "must be present"},
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
  end

  test "does not allow malformed time constraints" do
    result =
      TransportGenerator.generate_transport_props(%{earliest_start: "foo", latest_end: "bar"})
      |> Vehicle.make()

    assert result == [
             {
               :error,
               :earliest_start,
               :format,
               "must have the correct format"
             },
             {:error, :latest_end, :format, "must have the correct format"}
           ]
  end

  test "does not allow non integer weight capacity" do
    result =
      TransportGenerator.generate_transport_props(%{
        capacity: %{volume: 2, weight: 13.4}
      })
      |> Vehicle.make()

    assert result == [{:error, [:capacity, :weight], :by, "must be an integer"}]
  end

  test "does not allow non integer volume capacity" do
    result =
      TransportGenerator.generate_transport_props(%{earliest_start: "foo", latest_end: "bar"})
      |> Vehicle.make()

    assert result == [
             {:error, :earliest_start, :format, "must have the correct format"},
             {:error, :latest_end, :format, "must have the correct format"}
           ]
  end

  test "should validate addresses containing lat/lon" do
    result =
      TransportGenerator.generate_transport_props(%{
        capacity: %{volume: 1, weight: 123},
        earliest_start: nil,
        latest_end: nil,
        metadata: %{driver: %{}, profile: "123"},
        start_address: %{city: "", name: "hafdoajgjagia", street: ""}
      })
      |> Vehicle.make()

    assert result == [
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
  end

  test "should validate addresses lat/lon in correct format" do
    result =
      TransportGenerator.generate_transport_props(%{
        capacity: %{volume: 1, weight: 123},
        earliest_start: nil,
        latest_end: nil,
        metadata: %{driver: %{}, profile: "123"},
        start_address: %{
          lat: "21321321",
          lon: "2321312",
          city: "",
          name: "hafdoajgjagia",
          street: ""
        }
      })
      |> Vehicle.make()

    assert result == [
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
  end

  test "should allow vehicle to be updated" do
    id =
      TransportGenerator.generate_transport_props()
      |> Vehicle.make()

    updated_vehicle = %{
      id: id,
      start_address: %{lat: 13.37, lon: 13.37},
      end_address: %{lat: 13.37, lon: 13.37},
      earliest_start: nil,
      latest_end: nil,
      profile: "1337",
      capacity: %{volume: 1337, weight: 1337},
      metadata:
        "{\"recipient\":{\"contact\":\"0701234567\"},\"sender\":{\"contact\":\"0701234567\"}}"
    }

    Vehicle.update(updated_vehicle)

    %{
      start_address: start_address,
      end_address: end_address,
      profile: profile,
      capacity: capacity
    } = Vehicle.get(id)

    assert start_address == updated_vehicle.start_address
    assert end_address == updated_vehicle.end_address
    assert profile == updated_vehicle.profile
    assert capacity == updated_vehicle.capacity
  end
end
