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

    VRPSetting set() throws RouteOptimizationException {
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
    }
}