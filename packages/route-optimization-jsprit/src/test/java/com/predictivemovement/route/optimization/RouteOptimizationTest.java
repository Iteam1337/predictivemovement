package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.json.JSONObject;

import org.junit.jupiter.api.Test;

public class RouteOptimizationTest {

    private RouteOptimization routeOptimization;
    private JSONObject response;

    @Test
    public void one_booking_route_is_right() throws IOException {

        // given
        JSONObject routeRequest = readJsonFromFile("src/test/resources/tests/route_request_01.json");

        // when
        routeOptimization = new RouteOptimization();
        response = routeOptimization.calculate(routeRequest);

        // then
        JSONObject responseExpected = readJsonFromFile("src/test/resources/tests/route_response_01.json");
        assertEquals(responseExpected.toString(), response.toString());
    }

    @Test
    public void weight_constraint() throws IOException {
        // given
        JSONObject routeRequest = readJsonFromFile("src/test/resources/tests/route_request_weight_constraint.json");

        // when
        routeOptimization = new RouteOptimization();
        response = routeOptimization.calculate(routeRequest);

        // then
        JSONObject responseExpected = readJsonFromFile("src/test/resources/tests/route_response_weight_constraint.json");
        assertEquals(responseExpected.toString(), response.toString());
    }

    @Test
    public void volume_constraint() throws IOException {
        // given
        JSONObject routeRequest = readJsonFromFile("src/test/resources/tests/route_request_volume_constraint.json");

        // when
        routeOptimization = new RouteOptimization();
        response = routeOptimization.calculate(routeRequest);

        // then
        JSONObject responseExpected = readJsonFromFile("src/test/resources/tests/route_response_volume_constraint.json");
        assertEquals(responseExpected.toString(), response.toString());
    }



    private JSONObject readJsonFromFile(String filename) throws IOException {
        Path fileName = Path.of(filename);
        String msg = Files.readString(fileName);
        JSONObject json = new JSONObject(msg);
        return json;
    }
}