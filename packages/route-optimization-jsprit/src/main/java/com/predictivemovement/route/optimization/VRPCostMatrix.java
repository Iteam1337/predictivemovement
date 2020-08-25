package com.predictivemovement.route.optimization;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.cost.VehicleRoutingTransportCosts;
import com.graphhopper.jsprit.core.util.VehicleRoutingTransportCostsMatrix;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class creates a time-distance cost matrix.
 */
public class VRPCostMatrix {

    private VehicleRoutingTransportCostsMatrix.Builder costMatrixBuilder;
    private VehicleRoutingTransportCosts costMatrix;

    private JSONObject matrix;

    private List<String> sourceIds;
    private List<String> destinationIds;

    private Map<String, Location> routeLocations;

    public VehicleRoutingTransportCosts set(JSONObject routeRequest, Map<String, Location> locations) {
        if (!routeRequest.has("matrix"))
            return null;

        matrix = routeRequest.getJSONObject("matrix");
        if (matrix.isEmpty())
            return null;

        matrix = routeRequest.getJSONObject("matrix");
        routeLocations = locations;

        if (matrix.has("sources")) {
            JSONArray sourcesLocation = matrix.getJSONArray("sources");
            sourceIds = getLocationIdList(sourcesLocation);
        }

        if (matrix.has("destinations")) {
            JSONArray destinationLocations = matrix.getJSONArray("destinations");
            destinationIds = getLocationIdList(destinationLocations);
        }

        costMatrixBuilder = VehicleRoutingTransportCostsMatrix.Builder.newInstance(true);
        addTransportDurations();
        addTransportDistances();
        costMatrix = costMatrixBuilder.build();

        return costMatrix;
    }

    private void addTransportDurations() {
        if (!matrix.has("durations"))
            return;

        JSONArray costsMatrix = matrix.getJSONArray("durations");

        for (int i = 0; i < costsMatrix.length(); i++) {
            JSONArray costs = costsMatrix.getJSONArray(i);
            String sourceId = sourceIds.get(i);

            for (int j = 0; j < costs.length(); j++) {
                double cost = costs.getDouble(j);
                String destinationId = destinationIds.get(j);

                String sourceLocationId = routeLocations.get(sourceId).getId();
                String destinationLocationId = routeLocations.get(destinationId).getId();

                costMatrixBuilder.addTransportTime(sourceLocationId, destinationLocationId, cost);
            }
        }
    }

    private void addTransportDistances() {
        if (!matrix.has("distances"))
            return;

        JSONArray costsMatrix = matrix.getJSONArray("distances");

        for (int i = 0; i < costsMatrix.length(); i++) {
            JSONArray costs = costsMatrix.getJSONArray(i);
            String sourceId = sourceIds.get(i);

            for (int j = 0; j < costs.length(); j++) {
                double cost = costs.getDouble(j);
                String destinationId = destinationIds.get(j);

                String sourceLocationId = routeLocations.get(sourceId).getId();
                String destinationLocationId = routeLocations.get(destinationId).getId();

                costMatrixBuilder.addTransportDistance(sourceLocationId, destinationLocationId, cost);
            }
        }
    }

    private List<String> getLocationIdList(JSONArray locations) {
        List<String> locationIds = new ArrayList<>();

        for (int i = 0; i < locations.length(); i++) {
            JSONObject location = locations.getJSONObject(i);
            String locationId = location.getString("hint");
            locationIds.add(locationId);
        }
        return locationIds;
    }
}