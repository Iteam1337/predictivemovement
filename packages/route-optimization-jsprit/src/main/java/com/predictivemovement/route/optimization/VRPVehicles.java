package com.predictivemovement.route.optimization;

import java.util.ArrayList;
import java.util.List;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class sets the vehicles with their vehicle types for the VRP based on
 * the incoming request.
 */
public class VRPVehicles {

    List<VehicleImpl> vehicles;
    private VRPSetting vrpSetting;
    private JSONObject routeRequest;

    VRPVehicles(VRPSetting vrpSetting) {
        this.vrpSetting = vrpSetting;
        this.routeRequest = vrpSetting.routeRequest;
    }

    protected List<VehicleImpl> createVehicles() throws RouteOptimizationException {
        VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        vehicles = new ArrayList<>();

        JSONArray jsonVehicles = routeRequest.getJSONArray("vehicles");
        for (Object jsonVehicleObj : jsonVehicles) {
            JSONObject jsonVehicle = (JSONObject) jsonVehicleObj;

            // id
            String vehicleId = jsonVehicle.getString("id");
            VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance(vehicleId);

            // type
            VehicleType vehicleType = VRPVehiclesTypes.getType(jsonVehicle);
            vehicleBuilder.setType(vehicleType);

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

            // earliest start & latest arrival
            VehicleStartAndEndTimes startAndEndTimes = timeUtils.getVehicleStartAndEnd(jsonVehicle);
            if (startAndEndTimes.isSet()) {
                vehicleBuilder.setEarliestStart(startAndEndTimes.earliestStart);
                vehicleBuilder.setLatestArrival(startAndEndTimes.latestEnd);
            }

            VehicleImpl vehicle = vehicleBuilder.build();
            vehicles.add(vehicle);
        }

        return vehicles;
    }
}