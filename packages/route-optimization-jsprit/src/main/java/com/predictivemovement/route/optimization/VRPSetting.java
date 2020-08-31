package com.predictivemovement.route.optimization;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.cost.VehicleRoutingTransportCosts;
import com.graphhopper.jsprit.core.problem.job.Shipment;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;

import org.json.JSONObject;

/**
 * This class sets the vehicles, vehicle types and shipments for the VRP.
 */
public class VRPSetting {

    protected static final int VOLUME_INDEX = 0;
    protected static final int WEIGHT_INDEX = 1;

    List<VehicleImpl> vehicles;
    List<Shipment> shipments;
    VehicleRoutingTransportCosts routingCosts;

    protected JSONObject routeRequest;
    protected Map<String, Location> locations;

    VRPSetting(JSONObject routeRequest) {
        this.routeRequest = routeRequest;
    }

    VRPSetting set() {
        locations = new HashMap<>();

        vehicles = new VRPVehicles(this).createVehicles();
        shipments = new VRPShipments(this).createShipments();
        routingCosts = new VRPCostMatrix(this).createCostMatrix();

        return this;
    }

    protected Location getLocation(JSONObject jsonLocation) {
        float longitude = jsonLocation.getFloat("lon");
        float latitude = jsonLocation.getFloat("lat");
        Location location = Location.newInstance(longitude, latitude);
        return location;
    }<<<<<<<HEAD

    private int cubicMetersToCentimeter(int meters) {
        return meters * 1000 * 1000;
    }

    private VehicleType getVehicleType(JSONObject vehicle) {
        String profile = vehicle.optString("profile");
        JSONArray capacities = vehicle.optJSONArray("capacity");
        String vehicleId = profile != null ? profile : "vehicleDummyType";
        VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance(vehicleId);
        int volume = capacities != null ? cubicMetersToCentimeter(capacities.getInt(0)) : VEHICLE_DEFAULT_VOLUME;
        int weight = capacities != null ? capacities.getInt(1) : VEHICLE_DEFAULT_WEIGHT;
        vehicleTypeBuilder.addCapacityDimension(VOLUME_INDEX, volume);
        vehicleTypeBuilder.addCapacityDimension(WEIGHT_INDEX, weight);
        vehicleTypeBuilder.setCostPerDistance(1);
        vehicleTypeBuilder.setCostPerTransportTime(1);
        return vehicleTypeBuilder.build();
    }

    private int getVolumeFromMeasurements(JSONArray measurements) {
        if (measurements == null)
            return SHIPMENT_DEFAULT_VOLUME;
        int volume = 1;

        for (int i = 0; i < measurements.length(); i++) {
            int measurement = measurements.getInt(i);
            volume *= measurement;
        }

        return volume;
    }

    private void createCostMatrix() {
        routingCosts = new VRPCostMatrix().set(routeRequest, locations);
    }=======>>>>>>>27 c7c1bee9bea55e0f4763b53abc8d73d9e6b4c9
}