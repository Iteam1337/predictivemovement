package com.predictivemovement.route.optimization;

import java.util.Collection;

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.SchrimpfFactory;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
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

    VRPSolution(VRPSetting vrpSetting) {
        this.vrpSetting = vrpSetting;
    }

    VRPSolution calculate() {
        createVRP();
        findBestSolution();
        return this;
    }

    public void createVRP() {
        VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();

        for (VehicleImpl vehicle : vrpSetting.vehicles) {
            vrpBuilder.addVehicle(vehicle);
        }

        for (Shipment shipment : vrpSetting.shipments) {
            vrpBuilder.addJob(shipment);
        }

        problem = vrpBuilder.build();
    }

    private void findBestSolution() {
        VehicleRoutingAlgorithm algorithm = new SchrimpfFactory().createAlgorithm(problem);
        solutions = algorithm.searchSolutions();
        bestSolution = Solutions.bestOf(solutions);
    }
}