package com.predictivemovement.route.optimization;

import java.util.HashMap;
import java.util.Map;

import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;

import org.json.JSONObject;

import static com.predictivemovement.route.optimization.StatusResponse.Type.ERROR;

/**
 * This class...
 */
public class VRPVehiclesTypes {

    private static final int VEHICLE_DEFAULT_VOLUME = 3 * 1000 * 1000;
    private static final int VEHICLE_DEFAULT_WEIGHT = 5;

    private static Map<String, VehicleType> vehicle_types = new HashMap<String, VehicleType>();

    public static void clearCache() {
        vehicle_types = new HashMap<String, VehicleType>();
    }

    public static VehicleType getType(final JSONObject vehicle) throws RouteOptimizationException {

        final String vehicleId = getVehicleId(vehicle);

        // check for existsing vehicle types. Needed to be created only once!
        if (vehicle_types.containsKey(vehicleId)) {
            return vehicle_types.get(vehicleId);
        }

        final VehicleType vehicleType = createVehicleType(vehicleId, vehicle);
        return vehicleType;
    }

    private static String getVehicleId(final JSONObject vehicle) {
        final String profile = vehicle.optString("profile");
        final String vehicleId = profile != null ? profile : "vehicleDummyType";
        return vehicleId;
    }

    private static VehicleType createVehicleType(final String vehicleId, final JSONObject vehicle)
            throws RouteOptimizationException {

        final VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance(vehicleId);

        //
        final JSONObject capacities = vehicle.optJSONObject("capacity");

        // volume
        int volume = tryGetInteger(capacities, "volume", VEHICLE_DEFAULT_VOLUME);
        volume = cubicMetersToCentimeter(volume);
        vehicleTypeBuilder.addCapacityDimension(VRPSetting.VOLUME_INDEX, volume);

        // weight
        final int weight = tryGetInteger(capacities, "weight", VEHICLE_DEFAULT_WEIGHT);
        vehicleTypeBuilder.addCapacityDimension(VRPSetting.WEIGHT_INDEX, weight);

        // costs
        vehicleTypeBuilder.setCostPerDistance(1);
        vehicleTypeBuilder.setCostPerTransportTime(1);

        // cache types to make sure they are only created once
        final VehicleType vType = vehicleTypeBuilder.build();
        vehicle_types.put(vehicleId, vType);
        return vType;
    }

    private static int cubicMetersToCentimeter(final int meters) {
        return meters * 1000 * 1000;
    }

    private static int tryGetInteger(final JSONObject jsonObject, final String jsonField, final int defaultValue)
            throws RouteOptimizationException {
        try {
            return getInteger(jsonObject, jsonField, defaultValue);
        } catch (final NumberFormatException ex) {
            throw new RouteOptimizationException(ex, ERROR).setStatusMsg("Parameter not acceptable")
                    .setMessage(ex.getMessage()).setSource(jsonField)
                    .setDetail("The weight and volume of vehicles has to be an integer value.")
                    .setMeta(jsonObject.toString());
        }
    }

    private static int getInteger(final JSONObject jsonObject, final String jsonField, final int defaultValue)
            throws NumberFormatException {
        if (jsonObject != null) {
            if (jsonObject.has(jsonField)) {
                final Object value = jsonObject.get(jsonField);
                final int intValue = Integer.parseInt(value.toString());
                return intValue;
            }
        }

        return defaultValue;
    }
}
