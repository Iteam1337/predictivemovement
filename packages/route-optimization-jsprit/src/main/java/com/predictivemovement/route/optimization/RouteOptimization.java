package com.predictivemovement.route.optimization;

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.SchrimpfFactory;
import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.job.Activity;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.job.Shipment;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;
import com.graphhopper.jsprit.core.util.Solutions;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class RouteOptimization {

  // added to get access in tests for plotting
  public VehicleRoutingProblem problem;
  public Collection<VehicleRoutingProblemSolution> solutions;

  public String calculate(String msg) {
    JSONObject jsonMsg = new JSONObject(msg);

    // --- define vehicle types in general
    // should only be done once
    final int WEIGHT_INDEX = 0;

    VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance("vehicleTypeDummy");
    vehicleTypeBuilder.addCapacityDimension(WEIGHT_INDEX, 3);
    vehicleTypeBuilder.setCostPerDistance(1);
    VehicleType vehicleTypeDummy = vehicleTypeBuilder.build();

    // --- create vehicles
    List<VehicleImpl> vehicles = new ArrayList<>();

    JSONArray jsonVehicles = jsonMsg.getJSONArray("vehicles");
    for (Object jsonVehicle : jsonVehicles) {
      JSONObject jsonObjVehicle = (JSONObject) jsonVehicle;

      String vehicleId = jsonObjVehicle.getString("id");

      JSONObject jsonPosition = jsonObjVehicle.getJSONObject("position");
      float lon = jsonPosition.getFloat("lon");
      float lat = jsonPosition.getFloat("lat");

      VehicleImpl.Builder vehicleBuilder = VehicleImpl.Builder.newInstance(vehicleId);
      vehicleBuilder.setType(vehicleTypeDummy);
      vehicleBuilder.setStartLocation(Location.newInstance(lon, lat));
      VehicleImpl vehicle = vehicleBuilder.build();

      vehicles.add(vehicle);
    }

    // --- create shipments
    List<Shipment> shipments = new ArrayList<>();

    JSONArray jsonBookings = jsonMsg.getJSONArray("bookings");
    for (Object jsonBooking : jsonBookings) {
      JSONObject jsonObjBooking = (JSONObject) jsonBooking;

      String shipmentId = jsonObjBooking.getString("id");

      JSONObject jsonPickup = jsonObjBooking.getJSONObject("pickup");
      float pickupLon = jsonPickup.getFloat("lon");
      float pickupLat = jsonPickup.getFloat("lat");

      JSONObject jsonDelivery = jsonObjBooking.getJSONObject("delivery");
      float deliveryLon = jsonDelivery.getFloat("lon");
      float deliveryLat = jsonDelivery.getFloat("lat");

      Shipment.Builder shipmentBuilder = Shipment.Builder.newInstance(shipmentId);
      shipmentBuilder.addSizeDimension(WEIGHT_INDEX, 1);
      shipmentBuilder.setPickupLocation(Location.newInstance(pickupLon, pickupLat));
      shipmentBuilder.setDeliveryLocation(Location.newInstance(deliveryLon, deliveryLat));
      Shipment shipment = shipmentBuilder.build();

      shipments.add(shipment);
    }

    // --- VRP config

    VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();

    for (VehicleImpl vehicle : vehicles) {
      vrpBuilder.addVehicle(vehicle);
    }

    for (Shipment shipment : shipments) {
      vrpBuilder.addJob(shipment);
    }

    problem = vrpBuilder.build();

    // --- VRP run

    VehicleRoutingAlgorithm algorithm = new SchrimpfFactory().createAlgorithm(problem);
    solutions = algorithm.searchSolutions();
    VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions);

    // --- create response
    // SolutionPrinter.print(bestSolution);
    // System.out.println(bestSolution.getUnassignedJobs().size());
    // System.out.println(bestSolution.getRoutes().size());

    JSONArray jsonRoutes = new JSONArray();

    int i = 0;
    for (VehicleRoute vehicleRoute : bestSolution.getRoutes()) {
      i++;
      // System.out.println("---" + i);
      // System.out.println(vehicleRoute);

      JSONObject jsonRoute = new JSONObject();
      jsonRoutes.put(jsonRoute);

      jsonRoute.put("number", i);

      jsonRoute.put("vehicle_id", vehicleRoute.getVehicle().getId());

      // -- vehicle
      /*
       * JSONObject jsonVehicle = new JSONObject(); jsonRoute.put("vehicle",
       * jsonVehicle);
       * 
       * jsonVehicle.put("id", vehicleRoute.getVehicle().getId());
       * 
       * JSONObject jsonVehiclePosition = new JSONObject();
       * jsonVehicle.put("position", jsonVehiclePosition);
       * 
       * jsonVehiclePosition.put("lon",
       * vehicleRoute.getVehicle().getStartLocation().getCoordinate().getX());
       * jsonVehiclePosition.put("lat",
       * vehicleRoute.getVehicle().getStartLocation().getCoordinate().getY());
       */
      // --- activities
      JSONArray jsonActivities = new JSONArray();
      jsonRoute.put("activities", jsonActivities);

      // --- start
      {
        JSONObject jsonActivity = new JSONObject();
        jsonActivities.put(jsonActivity);

        jsonActivity.put("type", vehicleRoute.getStart().getName());
        jsonActivity.put("index", vehicleRoute.getStart().getIndex());

        JSONObject jsonActivityAddress = new JSONObject();
        jsonActivity.put("address", jsonActivityAddress);

        jsonActivityAddress.put("lon", vehicleRoute.getStart().getLocation().getCoordinate().getX());
        jsonActivityAddress.put("lat", vehicleRoute.getStart().getLocation().getCoordinate().getY());
      }

      /*
       * // System.out.println(vehicleRoute.getActivities().size()); for (TourActivity
       * activity : vehicleRoute.getActivities()) { System.out.println(activity); }
       * System.out.println("----"); TourActivities tourActivity =
       * vehicleRoute.getTourActivities(); for (TourActivity activity :
       * tourActivity.getActivities()) { System.out.println(activity); }
       * System.out.println("----");
       */

      for (Job job : vehicleRoute.getTourActivities().getJobs()) {
        for (Activity activity : job.getActivities()) {
          // System.out.println(activity);
          JSONObject jsonActivity = new JSONObject();
          jsonActivities.put(jsonActivity);

          jsonActivity.put("type", activity.getActivityType());
          // jsonActivity.put("index", job.getIndex());
          jsonActivity.put("id", job.getId());

          JSONObject jsonActivityAddress = new JSONObject();
          jsonActivity.put("address", jsonActivityAddress);

          jsonActivityAddress.put("lon", activity.getLocation().getCoordinate().getX());
          jsonActivityAddress.put("lat", activity.getLocation().getCoordinate().getY());
        }
      }

      // System.out.println(vehicleRoute.getTourActivities().getActivities());
      // for (TourActivity activity :
      // vehicleRoute.getTourActivities().getActivities()) {
      // System.out.println("---");
      // System.out.println(activity);
      // }

      // System.out.println("-----");
      // System.out.println(vehicleRoute.getTourActivities().getJobs());
      // vehicleRoute.getTourActivities().getJobs().forEach(job -> {
      // System.out.println(job);
      // System.out.println(job.getId());
      // System.out.println(job.getIndex());
      // System.out.println(job.getName());
      // System.out.println(job.getActivities());
      // });
      // System.out.println("-----");

      // --- end
      {
        JSONObject jsonActivity = new JSONObject();

        jsonActivities.put(jsonActivity);

        jsonActivity.put("type", vehicleRoute.getEnd().getName());
        jsonActivity.put("index", vehicleRoute.getEnd().getIndex());
        jsonActivity.put("index", vehicleRoute.getEnd().getIndex());
        // booking id ... is just called id here
        // jsonActivity.put("id", "where do get?");

        JSONObject jsonActivityAddress = new JSONObject();
        jsonActivity.put("address", jsonActivityAddress);

        jsonActivityAddress.put("lon", vehicleRoute.getEnd().getLocation().getCoordinate().getX());
        jsonActivityAddress.put("lat", vehicleRoute.getEnd().getLocation().getCoordinate().getY());
      }
    }

    // JSONObject jsonResponse = jsonMsg;
    JSONObject jsonSolution = new JSONObject();
    jsonSolution.put("routes", jsonRoutes);

    JSONObject jsonResponse = new JSONObject();
    jsonResponse.put("solution", jsonSolution);

    return jsonResponse.toString();
  }
}