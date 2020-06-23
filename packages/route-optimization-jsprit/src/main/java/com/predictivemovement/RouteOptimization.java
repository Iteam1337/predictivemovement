package package com.predictivemovement.evaluation;


import com.graphhopper.jsprit.analysis.toolbox.GraphStreamViewer;
import com.graphhopper.jsprit.analysis.toolbox.GraphStreamViewer.Label;
import com.graphhopper.jsprit.analysis.toolbox.Plotter;
import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.Jsprit;
import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.job.Service;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl.Builder;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;
import com.graphhopper.jsprit.core.reporting.SolutionPrinter;
import com.graphhopper.jsprit.core.util.Solutions;
import com.graphhopper.jsprit.io.problem.VrpXMLWriter;

import java.io.File;
import java.util.Collection;

/**
{"vehicles":[{"position":{"lon":16.225352,"lat":61.736082},"metadata":{},"id":"pmv-1zuURKyc","current_route":null,"busy":false,"booking_ids":[],"activities":[]}],
"bookings":[{"pickup":{"lon":16.02416,"lat":61.789304},"metadata":{},"id":"pmb-4FbTaQFr","external_id":94107,"events":[],"delivery":{"lon":15.99835,"lat":61.898623},"assigned_to":null}],
"matrix": {}}
 */

/** output
%{
  copyrights: ["GraphHopper", "OpenStreetMap contributors"],
  job_id: "da48bfe5-07ff-4e0e-b31b-1c452e576bd3",
  processing_time: 39,
  solution: %{
    completion_time: 2737,
    costs: 232,
    distance: 37259, 
    max_operation_time: 2737,
    no_unassigned: 0,
    no_vehicles: 1,
    preparation_time: 0,
    routes: [
      %{
        activities: [
          %{
            address: %{lat: 61.842302, location_id: "521537", lon: 15.914518},
            distance: 0,
            driving_time: 0,
            end_date_time: nil,
            end_time: 0,
            load_after: [0],
            location_id: "521537",
            preparation_time: 0,
            type: "start",
            waiting_time: 0
          },
          %{
            address: %{lat: 61.918197, location_id: "486284", lon: 16.138},
            arr_date_time: nil,
            arr_time: 1617,
            distance: 22251,
            driving_time: 1617,
            end_date_time: nil,
            end_time: 1617,
            id: "pmb-6QYMNJ9e", 
            load_after: [1],
            load_before: [0],
            location_id: "486284",
            preparation_time: 0,
            type: "pickupShipment",
            waiting_time: 0
          },
          %{
            address: %{lat: 61.815127, location_id: "83908", lon: 16.079536},
            arr_date_time: nil,
            arr_time: 2737,
            distance: 37259,
            driving_time: 2737,
            end_date_time: nil,
            end_time: 2737,
            id: "pmb-6QYMNJ9e",
            load_after: [0],
            load_before: [1],
            location_id: "83908",
            preparation_time: 0,
            type: "deliverShipment",
            waiting_time: 0
          }
        ],
        completion_time: 2737, 
        distance: 37259,
        preparation_time: 0,
        service_duration: 0,
        transport_time: 2737,
        vehicle_id: "pmv-2WOyjwGP",
        waiting_time: 0
      }
    ],
    service_duration: 0,
    time: 2737,
    transport_time: 2737,
    unassigned: %{breaks: [], details: [], services: [], shipments: []},
    waiting_time: 0
  },
  status: "finished",
  waiting_time_in_queue: 0
}

 */

public class RouteOptimization {

    public String calculate(String msg) {
        const cars = msg.cars
        for (car in cars) {
            vehicleBuilder.setStartLocation(Location.newInstance(car.lon, car.lat));
        }
		// random
		// nearest
        final int WEIGHT_INDEX = 0;

        VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance("vehicleType")
                                                .addCapacityDimension(WEIGHT_INDEX, 2);

        VehicleType vehicleType = vehicleTypeBuilder.build();

        /*
         * get a vehicle-builder and build a vehicle located at (10,10) with type
         * "vehicleType"
         */
        Builder vehicleBuilder = VehicleImpl.Builder.newInstance("vehicle");
        // start location of the car/truck ... package hub
        vehicleBuilder.setStartLocation(Location.newInstance(10, 10));
        vehicleBuilder.setType(vehicleType);
        VehicleImpl vehicle = vehicleBuilder.build();

        // destionation
        Service service1 = Service.Builder.newInstance("1").addSizeDimension(WEIGHT_INDEX, 1)
                        .setLocation(Location.newInstance(5, 7)).build();

        Service service2 = Service.Builder.newInstance("2").addSizeDimension(WEIGHT_INDEX, 1)
                        .setLocation(Location.newInstance(5, 13)).build();

        Service service3 = Service.Builder.newInstance("3").addSizeDimension(WEIGHT_INDEX, 1)
                        .setLocation(Location.newInstance(15, 7)).build();

        Service service4 = Service.Builder.newInstance("4").addSizeDimension(WEIGHT_INDEX, 1)
                        .setLocation(Location.newInstance(15, 13)).build();

        Service service5 = Service.Builder.newInstance("5").addSizeDimension(WEIGHT_INDEX, 2)
                        .setLocation(Location.newInstance(1, 13)).build();


        // boilder plate
        VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();
        vrpBuilder.addVehicle(vehicle);
        vrpBuilder.addJob(service1).addJob(service2).addJob(service3).addJob(service4).addJob(service5);

        VehicleRoutingProblem problem = vrpBuilder.build();

        VehicleRoutingAlgorithm algorithm = Jsprit.createAlgorithm(problem);

        Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions();

        VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions);

        // TODO convert to 'engine' output 
        // new VrpXMLWriter(problem, solutions).write("output/problem-with-solution.xml");

        return msg;
    }
}