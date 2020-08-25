package com.predictivemovement.route.optimization;

import java.util.ArrayList;
import java.util.List;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class sets the vehicles with their vehicle types for the VRP based on
 * the incoming request.
 */
public class VRPVehicles {

    private static final int VEHICLE_DEFAULT_VOLUME = 3 * 1000 * 1000;
    private static final int VEHICLE_DEFAULT_WEIGHT = 5;

    List<VehicleImpl> vehicles;
    private VRPSetting vrpSetting;
    private JSONObject routeRequest;

    VRPVehicles(VRPSetting vrpSetting) {
        this.vrpSetting = vrpSetting;
        this.routeRequest = vrpSetting.routeRequest;
    }

    protected List<VehicleImpl> createVehicles() {
        VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        vehicles = new ArrayList<>();

        JSONArray jsonVehicles = routeRequest.getJSONArray("vehicles");
        for (Object jsonVehicleObj : jsonVehicles) {
            JSONObject jsonVehicle = (JSONObject) jsonVehicleObj;

            // id
            String vehicleId = jsonVehicle.getString("id");
            VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance(vehicleId);

            // type
            vehicleBuilder.setType(getVehicleType(jsonVehicle));

            // start address
            JSONObject startAddress = jsonVehicle.getJSONObject("start_address");
            Location vehicleStartAddress = vrpSetting.getLocation(startAddress);
            vehicleBuilder.setStartLocation(vehicleStartAddress);
            vrpSetting.locations.put(startAddress.getString("hint"), vehicleStartAddress);

            // end address
            JSONObject endAddress = jsonVehicle.getJSONObject("end_address");
            Location vehicleEndAddress = vrpSetting.getLocation(endAddress);
            vehicleBuilder.setEndLocation(vehicleEndAddress);
            vrpSetting.locations.put(endAddress.getString("hint"), vehicleEndAddress);

            // earliest start
            double earliestStart = timeUtils.getTimeDifferenceFromNow(jsonVehicle, "earliest_start", 0.0);
            vehicleBuilder.setEarliestStart(earliestStart);

            // latest arrival
            double latestArrival = timeUtils.getTimeDifferenceFromNow(jsonVehicle, "latest_end", Double.MAX_VALUE);
            vehicleBuilder.setLatestArrival(latestArrival);

            VehicleImpl vehicle = vehicleBuilder.build();
            vehicles.add(vehicle);
        }

        return vehicles;
    }

    private VehicleType getVehicleType(JSONObject vehicle) {

        // id
        String profile = vehicle.optString("profile");
        String vehicleId = profile != null ? profile : "vehicleDummyType";
        VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance(vehicleId);

        //
        JSONArray capacities = vehicle.optJSONArray("capacity");

        // TODO use different JSON fields for volume and weight?!

        // volume
        int volume = capacities != null ? cubicMetersToCentimeter(capacities.getInt(0)) : VEHICLE_DEFAULT_VOLUME;
        vehicleTypeBuilder.addCapacityDimension(VRPSetting.VOLUME_INDEX, volume);

        // weight
        int weight = capacities != null ? capacities.getInt(1) : VEHICLE_DEFAULT_WEIGHT;
        vehicleTypeBuilder.addCapacityDimension(VRPSetting.WEIGHT_INDEX, weight);

        // costs
        vehicleTypeBuilder.setCostPerDistance(1);
        vehicleTypeBuilder.setCostPerTransportTime(1);

        return vehicleTypeBuilder.build();
    }

    private int cubicMetersToCentimeter(int meters) {
        return meters * 1000 * 1000;
    }
}