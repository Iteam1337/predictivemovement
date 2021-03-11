package com.predictivemovement.route.optimization;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import com.graphhopper.jsprit.analysis.toolbox.Plotter;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TourActivity;
import com.graphhopper.jsprit.core.util.Solutions;

import org.json.JSONObject;

public class TryRouteOptimization {

    private VRPSolution vrpSolution;
    private JSONObject response;

    public static void main(final String args[]) throws Exception {
        TryRouteOptimization tryOut = new TryRouteOptimization();
        try {
            tryOut.jsprit();
        } catch (RouteOptimizationException exception) {
            String errorResponse = new ErrorResponse(exception).create();
            System.out.println(errorResponse);
            throw exception;
        }
    }

    public void jsprit() throws Exception {
        // given
        Path fileName = Path.of("src/test/resources/msg/06/06_route_request.json");
        String msg = Files.readString(fileName);
        JSONObject routeRequest = new JSONObject(msg);

        // when
        RouteProcessing routeProcessing = new RouteProcessingWithMetrics();
        routeProcessing.calculate(routeRequest);
        vrpSolution = routeProcessing.getVRPSolution();
        StatusResponse statusResponse = routeProcessing.getStatusResponse();
        response = statusResponse.status;

        // then
        debugOutput();
        // System.out.println(response);
    }

    private void debugOutput() throws IOException {
        new File("tmp").mkdirs();
        dump();
        plot();
        writeJsonFile();
    }

    private void plot() {
        // plot shipments
        Plotter problemPlotter = new Plotter(vrpSolution.problem);
        problemPlotter.plotShipments(true);
        problemPlotter.plot("tmp/route_problem.png", "Route Problem");

        // plot solution
        Iterator<VehicleRoute> solutionsIterator = Solutions.bestOf(vrpSolution.solutions).getRoutes().iterator();
        if (!solutionsIterator.hasNext())
            return;

        List<VehicleRoute> solutionsList = Arrays.asList(solutionsIterator.next());

        Plotter solutionPlotter = new Plotter(vrpSolution.problem, solutionsList);
        solutionPlotter.plotShipments(true);
        solutionPlotter.plot("tmp/route_solution.png", "Route Solution");
    }

    private void writeJsonFile() throws IOException {
        Path filepath = Paths.get("tmp/response.json");
        Files.write(filepath, response.toString().getBytes());
    }

    private void dump() {
        System.out.println(vrpSolution.solutions);

        System.out.println("Number of solutions: " + vrpSolution.solutions.size());

        int i = 0;
        for (VehicleRoutingProblemSolution solution : vrpSolution.solutions) {
            System.out.println("\n--- solution: " + i);
            System.out.println(solution);
            for (VehicleRoute route : solution.getRoutes()) {
                // System.out.println(route);
                // System.out.println(route.getStart());
                // System.out.println(route.getEnd());
                for (TourActivity activity : route.getActivities()) {
                    System.out.println("-- activity");
                    System.out.println(activity);
                    System.out.println(activity.getArrTime());
                    System.out.println(activity.getEndTime());
                    System.out.println(activity.getOperationTime());
                }
            }

            for (Job job : solution.getUnassignedJobs()) {
                System.out.println("-- job");
                System.out.println(job);
                System.out.println(job.getId());
                System.out.println(job.getIndex());
                System.out.println(job.getMaxTimeInVehicle());
                System.out.println(job.getSize());
                System.out.println(job.getActivities());
            }

            i++;
        }
    }
}