package com.predictivemovement.route.optimization;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.json.JSONObject;
import org.junit.Test;

public class MQApplicationProcessingTypeTest {

    @Test
    public void basicRouteProcessingIsSet() {
        // given
        JSONObject routeRequest = new JSONObject();
        routeRequest.put("metrics", "FalSe");

        // when
        MQApplication mqApplication = new MQApplication();
        RouteProcessing routeProcessing = mqApplication.newRouteProcessing(routeRequest);

        // then
        assertTrue(routeProcessing instanceof RouteProcessingBasic);
    }

    @Test
    public void metricRouteProcessingIsSet() {
        // given
        JSONObject routeRequest = new JSONObject();
        routeRequest.put("metrics", "tRue");

        // when
        MQApplication mqApplication = new MQApplication();
        RouteProcessing routeProcessing = mqApplication.newRouteProcessing(routeRequest);

        // then
        assertTrue(routeProcessing instanceof RouteProcessingWithMetrics);
    }

    @Test
    public void metricRouteProcessingIsNotSet() {
        // given
        JSONObject routeRequest = new JSONObject();

        // when
        MQApplication mqApplication = new MQApplication();
        RouteProcessing routeProcessing = mqApplication.newRouteProcessing(routeRequest);

        // then
        assertTrue(routeProcessing instanceof RouteProcessing);
    }
}