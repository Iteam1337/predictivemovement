package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.fail;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.TreeMap;

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
    public void simple_one_car_one_boooking_route() throws Exception {
        test_route_optimization("src/test/resources/msg/01/01_route_request.json",
                "src/test/resources/msg/01/01_route_response.json");
    }

    @Test
    public void crossing_river_on_shortest_path_without_matrix() throws Exception {
        test_route_optimization("src/test/resources/msg/02/02_route_request.json",
                "src/test/resources/msg/02/02_route_response.json");
    }

    @Test
    public void crossing_river_avoided_with_matrix() throws Exception {
        test_route_optimization("src/test/resources/msg/03/03_route_request.json",
                "src/test/resources/msg/03/03_route_response.json");
    }

    @Test
    public void shortest_path_is_avoided_by_pickup_time_constraints() throws Exception {
        test_route_optimization("src/test/resources/msg/04/04_route_request.json",
                "src/test/resources/msg/04/04_route_response.json");
    }

    @Test
    public void pickup_time_constraint_in_the_past_not_achievable() throws Exception {
        test_route_optimization("src/test/resources/msg/05/05_route_request.json",
                "src/test/resources/msg/05/05_route_response.json");
    }

    @Test
    public void two_pickup_time_constraint_in_conflict() throws Exception {
        test_route_optimization("src/test/resources/msg/06/06_route_request.json",
                "src/test/resources/msg/06/06_route_response.json");
    }

    // TODO
    // @Test
    public void two_pickup_time_constraint_conflict_with_two_vehicle_solution() throws Exception {
        test_route_optimization("src/test/resources/msg/07/07_route_request.json",
                "src/test/resources/msg/07/07_route_response.json");
    }

    // @Test
    public void constraint_on_vehicle_volume_makes_only_one_booking_at_the_time_possible() throws Exception {
        test_route_optimization("src/test/resources/msg/08/08_route_request.json",
                "src/test/resources/msg/08/08_route_response.json");
    }

    // @Test
    public void constraint_on_weight_volume_makes_only_one_booking_at_the_time_possible() throws Exception {
        test_route_optimization("src/test/resources/msg/09/09_route_request.json",
                "src/test/resources/msg/09/09_route_response.json");
    }

    @Test
    public void two_routes_for_two_vehicles() throws Exception {
        test_route_optimization("src/test/resources/msg/10/10_route_request.json",
                "src/test/resources/msg/10/10_route_response.json");
    }

    @Test
    public void two_vehicles_with_same_type() throws Exception {
        test_route_optimization("src/test/resources/msg/13/13_route_request.json",
                "src/test/resources/msg/13/13_route_response.json");
    }

    @Test
    public void wrong_capacity_type_error() throws Exception {
        RouteOptimizationException exception = assertThrows(RouteOptimizationException.class, () -> {
            test_route_optimization("src/test/resources/msg/14/14_route_request.json", null);
        });
        assertEquals("java.lang.NumberFormatException: For input string: \"10.8\"", exception.getMessage());
    }

    @Test
    public void wrong_capacity_type_error_response() throws Exception {
        try {
            test_route_optimization("src/test/resources/msg/14/14_route_request.json", null);
        } catch (RouteOptimizationException exception) {
            test_error_response(exception, "src/test/resources/msg/14/14_route_response.json");
            return;
        }
        fail("Should have thrown an exception");
    }

    @Test
    public void status_response_is_set() throws Exception {
        test_route_optimization("src/test/resources/msg/15/15_route_request.json",
                "src/test/resources/msg/15/15_route_response.json");
    }

    @Test
    public void vehicle_time_schedule() throws Exception {
        test_route_optimization("src/test/resources/msg/16/16_route_request.json",
                "src/test/resources/msg/16/16_route_response.json");
    }

    private void test_route_optimization(String requestFilename, String expectedResponseFilename) throws Exception {
        // given
        JSONObject routeRequest = readJsonFromFile(requestFilename);

        // when
        RouteOptimization routeOptimization = new RouteOptimization();
        VRPSolution vrpSolution = routeOptimization.calculate(routeRequest);
        StatusResponse statusResponse = new StatusResponse(vrpSolution);
        JSONObject response = statusResponse.status;

        // then
        TreeMap<String, Object> responseOrdered = convertToOrderdJson(response);

        JSONObject responseExpected = readJsonFromFile(expectedResponseFilename);
        TreeMap<String, Object> responseExpectedOrdered = convertToOrderdJson(responseExpected);

        assertEquals(responseExpectedOrdered.toString(), responseOrdered.toString());
    }

    private void test_error_response(RouteOptimizationException exception, String expectedResponseFilename)
            throws Exception {
        ErrorResponse errorResponse = new ErrorResponse(exception);
        errorResponse.create();
        TreeMap<String, Object> responseOrdered = convertToOrderdJson(errorResponse.response.status);

        JSONObject responseExpected = readJsonFromFile(expectedResponseFilename);
        TreeMap<String, Object> responseExpectedOrdered = convertToOrderdJson(responseExpected);
        assertEquals(responseExpectedOrdered, responseOrdered);
    }

    private JSONObject readJsonFromFile(String filename) throws IOException {
        Path fileName = Path.of(filename);
        String msg = Files.readString(fileName);
        JSONObject json = new JSONObject(msg);
        return json;
    }

    private TreeMap<String, Object> convertToOrderdJson(JSONObject jsonObject) {
        TreeMap<String, Object> orderedJsonObj = new TreeMap<>();

        for (String key : jsonObject.keySet()) {
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                value = convertToOrderdJson((JSONObject) value);
            }

            orderedJsonObj.put(key, value);
        }

        return orderedJsonObj;
    }
}