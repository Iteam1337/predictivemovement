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
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.util.Solutions;

//import org.junit.jupiter.api.Test;

// ...maybe later it will be a real test
public class RouteOptimizationTest {

    private RouteOptimization routeOptimization;
    private String response;

    public static void main(final String args[]) throws IOException {
        RouteOptimizationTest tryOut = new RouteOptimizationTest();
        tryOut.jsprit();
    }

    // @Test
    public void jsprit() throws IOException {

        // given
        Path fileName = Path.of("src/test/resources/incoming_msg_01.json");
        String msg = Files.readString(fileName);

        // when
        routeOptimization = new RouteOptimization();
        response = routeOptimization.calculate(msg);

        // then
        debugOutput();
        // System.out.println(response);
    }

    private void debugOutput() throws IOException {
        new File("tmp").mkdirs();
        plot();
        writeJsonFile();
    }

    private void plot() {
        Plotter problemPlotter = new Plotter(routeOptimization.problem);
        problemPlotter.plotShipments(true);
        problemPlotter.plot("tmp/route_problem.png", "Route Problem");

        Iterator<VehicleRoute> solutionsIterator = Solutions.bestOf(routeOptimization.solutions).getRoutes().iterator();
        List<VehicleRoute> solutionsList = Arrays.asList(solutionsIterator.next());

        Plotter solutionPlotter = new Plotter(routeOptimization.problem, solutionsList);
        solutionPlotter.plotShipments(true);
        solutionPlotter.plot("tmp/route_solution.png", "Route Solution");
    }

    private void writeJsonFile() throws IOException {
        Path filepath = Paths.get("tmp/response.json");
        Files.write(filepath, response.getBytes());
    }
}