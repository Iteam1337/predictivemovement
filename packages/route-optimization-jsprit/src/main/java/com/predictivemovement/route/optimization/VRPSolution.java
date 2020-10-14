package com.predictivemovement.route.optimization;

import java.util.Collection;

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.SchrimpfFactory;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem.FleetSize;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.job.Shipment;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.util.Solutions;

/**
 * This class calculates a 'best' route solution for a vehicle routing problem.
 */
public class VRPSolution {

    private VRPSetting vrpSetting;

    // to get access in test for plotting
    VehicleRoutingProblem problem;
    Collection<VehicleRoutingProblemSolution> solutions;

    VehicleRoutingProblemSolution bestSolution;

    ExcludedBookings excludedBookings;

    VRPSolution(VRPSetting vrpSetting) {
        this.vrpSetting = vrpSetting;
        this.excludedBookings = vrpSetting.excludedBookings;
    }

    VRPSolution calculate() throws RouteOptimizationException {
        createVRP();
        findBestSolution();
        addExcludedBookings();
        return this;
    }

    public void createVRP() {
        VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();

        for (VehicleImpl vehicle : vrpSetting.vehicles) {
            vrpBuilder.addVehicle(vehicle);
            vrpBuilder.setFleetSize(FleetSize.FINITE);
        }

        for (Shipment shipment : vrpSetting.shipments) {
            vrpBuilder.addJob(shipment);
        }

        if (vrpSetting.routingCosts != null) {
            vrpBuilder.setRoutingCost(vrpSetting.routingCosts);
        }

        problem = vrpBuilder.build();
    }

    private void findBestSolution() {
        VehicleRoutingAlgorithm algorithm = new SchrimpfFactory().createAlgorithm(problem);

        solutions = algorithm.searchSolutions();
        bestSolution = Solutions.bestOf(solutions);
    }

    private void addExcludedBookings() {
        if (bestSolution.getUnassignedJobs().size() > 0) {
            for (Job job : bestSolution.getUnassignedJobs()) {
                excludedBookings.add(job);
            }
        }
    }
}