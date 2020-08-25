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
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.util.Solutions;

import org.json.JSONObject;

public class TryRouteOptimization {

    private RouteOptimization routeOptimization;
    private JSONObject response;

    public static void main(final String args[]) throws IOException {
        TryRouteOptimization tryOut = new TryRouteOptimization();
        tryOut.jsprit();
    }

    public void jsprit() throws IOException {

        // given
        // Path fileName = Path.of("src/test/resources/msg/03/03_route_request.json");
        // Path fileName = Path.of("src/test/resources/msg/05/05_route_request.json");
        // Path fileName = Path.of("src/test/resources/msg/06/06_route_request.json");
        Path fileName = Path.of("src/test/resources/msg/09/09_route_request.json");
        String msg = Files.readString(fileName);
        JSONObject routeRequest = new JSONObject(msg);

        // when
        routeOptimization = new RouteOptimization();
        response = routeOptimization.calculate(routeRequest);

        // then
        debugOutput();
        // System.out.println(response);
    }

    private void debugOutput() throws IOException {
        new File("tmp").mkdirs();
        plot();
        writeJsonFile();
        dump();
    }

    private void plot() {
        // plot shipments
        Plotter problemPlotter = new Plotter(routeOptimization.vrpSolution.problem);
        problemPlotter.plotShipments(true);
        problemPlotter.plot("tmp/route_problem.png", "Route Problem");

        // plot solution
        Iterator<VehicleRoute> solutionsIterator = Solutions.bestOf(routeOptimization.vrpSolution.solutions).getRoutes()
                .iterator();
        List<VehicleRoute> solutionsList = Arrays.asList(solutionsIterator.next());

        Plotter solutionPlotter = new Plotter(routeOptimization.vrpSolution.problem, solutionsList);
        solutionPlotter.plotShipments(true);
        solutionPlotter.plot("tmp/route_solution.png", "Route Solution");
    }

    private void writeJsonFile() throws IOException {
        Path filepath = Paths.get("tmp/response.json");
        Files.write(filepath, response.toString().getBytes());
    }

    private void dump() {
        System.out.println(routeOptimization.vrpSolution.solutions);

        System.out.println("Number of solutions: " + routeOptimization.vrpSolution.solutions.size());

        for (VehicleRoutingProblemSolution solution : routeOptimization.vrpSolution.solutions) {
            System.out.println("\n--- next solution");
            System.out.println(solution);
        }
    }
}