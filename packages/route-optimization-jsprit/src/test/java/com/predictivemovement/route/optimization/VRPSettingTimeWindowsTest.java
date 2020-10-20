package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.ZonedDateTime;
import org.json.JSONObject;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;
import org.junit.jupiter.api.Test;

public class VRPSettingTimeWindowsTest {

    private static TimeWindow timeWindowToAdd;

    @Test
    public void no_time_window_is_add() throws Exception {
        // init
        timeWindowToAdd = null;

        // given
        String jsonString = "{}";
        JSONObject routeRequest = new JSONObject(jsonString);

        // when
        VRPSettingTimeWindows settingTimeWindows = new VRPSettingTimeWindows();
        settingTimeWindows.add(routeRequest, (timeWindow) -> {
            timeWindowToAdd = timeWindow;
        });

        // then
        assertNull(timeWindowToAdd);
    }

    @Test
    public void excpetion_on_times_in_the_past() throws Exception {
        // init
        timeWindowToAdd = null;

        // given
        String jsonString = "{ \"time_windows\": [{\"latest\":\"1979-08-12T15:21:28.251Z\"}]}";
        JSONObject routeRequest = new JSONObject(jsonString);

        // when
        VRPSettingTimeWindows settingTimeWindows = new VRPSettingTimeWindows();
        RouteOptimizationException exception = assertThrows(RouteOptimizationException.class, () -> {
            settingTimeWindows.add(routeRequest, (timeWindow) -> {
                timeWindowToAdd = timeWindow;
            });
        });
        assertEquals("Time of time window constraint is in the past!", exception.statusMsg);
    }

    @Test
    public void given_time_window_is_add() throws Exception {
        // init
        timeWindowToAdd = null;

        // given
        ZonedDateTime now = ZonedDateTime.now();
        String earliest = now.plusSeconds(1000).toString();
        String latest = now.plusSeconds(2000).toString();

        String jsonString = "{ 'time_windows': [ { 'earliest' : '" + earliest + "', 'latest' : '" + latest + "'}]}";
        jsonString.replace("'", "\"");
        JSONObject routeRequest = new JSONObject(jsonString);

        // when
        VRPSettingTimeWindows settingTimeWindows = new VRPSettingTimeWindows();
        settingTimeWindows.add(routeRequest, (timeWindow) -> {
            timeWindowToAdd = timeWindow;
        });

        // then
        assertEquals(1000, timeWindowToAdd.getStart(), 2);
        assertEquals(2000, timeWindowToAdd.getEnd(), 2);
    }
}