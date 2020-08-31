package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.json.JSONObject;

import org.junit.jupiter.api.Test;

/**
 * This class keeps high level test cases for different incoming request
 * messages. The cases are expecting an special optimized route as response. You
 * can find more information about the test case in the request messages meta
 * field.
 */
public class RouteOptimizationTest {

    @Test
    public void simple_one_car_one_boooking_route() throws IOException {
        test_route_optimization("src/test/resources/msg/01/01_route_request.json",
                "src/test/resources/msg/01/01_route_response.json");
    }

    @Test
    public void crossing_river_on_shortest_path_without_matrix() throws IOException {
        test_route_optimization("src/test/resources/msg/02/02_route_request.json",
                "src/test/resources/msg/02/02_route_response.json");
    }

    @Test
    public void crossing_river_avoided_with_matrix() throws IOException {
        test_route_optimization("src/test/resources/msg/03/03_route_request.json",
                "src/test/resources/msg/03/03_route_response.json");
    }

    @Test
    public void shortest_path_is_avoided_by_pickup_time_constraints() throws IOException {
        test_route_optimization("src/test/resources/msg/04/04_route_request.json",
                "src/test/resources/msg/04/04_route_response.json");
    }

    // TODO
    // @Test
    public void pickup_time_constraint_in_the_past_not_achievable() throws IOException {
        test_route_optimization("src/test/resources/msg/05/05_route_request.json",
                "src/test/resources/msg/05/05_route_response.json");
    }

    // TODO
    // @Test
    public void two_pickup_time_constraint_in_conflict() throws IOException {
        test_route_optimization("src/test/resources/msg/06/06_route_request.json",
                "src/test/resources/msg/06/06_route_response.json");
    }

    // TODO
    // @Test
    public void two_pickup_time_constraint_conflict_with_two_vehicle_solution() throws IOException {
        test_route_optimization("src/test/resources/msg/07/07_route_request.json",
                "src/test/resources/msg/07/07_route_response.json");
    }

    @Test
    public void constraint_on_vehicle_volume_makes_only_one_booking_at_the_time_possible() throws IOException {
        test_route_optimization("src/test/resources/msg/08/08_route_request.json",
                "src/test/resources/msg/08/08_route_response.json");
    }

    @Test
    public void constraint_on_weight_volume_makes_only_one_booking_at_the_time_possible() throws IOException {
        test_route_optimization("src/test/resources/msg/09/09_route_request.json",
                "src/test/resources/msg/09/09_route_response.json");
    }

    private void test_route_optimization(String requestFilename, String expectedResponseFilename) throws IOException {
        // given
        JSONObject routeRequest = readJsonFromFile(requestFilename);

        // when
        RouteOptimization routeOptimization = new RouteOptimization();
        JSONObject response = routeOptimization.calculate(routeRequest);

        // then
        JSONObject responseExpected = readJsonFromFile(expectedResponseFilename);
        assertEquals(responseExpected.toString(), response.toString());
    }

    private JSONObject readJsonFromFile(String filename) throws IOException {
        Path fileName = Path.of(filename);
        String msg = Files.readString(fileName);
        JSONObject json = new JSONObject(msg);
        return json;
    }
}