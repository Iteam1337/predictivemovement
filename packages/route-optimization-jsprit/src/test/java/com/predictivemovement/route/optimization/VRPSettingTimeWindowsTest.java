package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.ZonedDateTime;
import org.json.JSONObject;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;
import org.junit.jupiter.api.Test;

public class VRPSettingTimeWindowsTest {

    private static TimeWindow timeWindowToAdd;

    @Test
    public void no_time_window_is_add() {
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
    public void default_time_window_is_add() {
        // init
        timeWindowToAdd = null;

        // given
        String jsonString = "{ \"time_windows\": [{\"latest\":\"2020-08-12T15:21:28.251Z\"}]}";
        JSONObject routeRequest = new JSONObject(jsonString);

        // when
        VRPSettingTimeWindows settingTimeWindows = new VRPSettingTimeWindows();
        settingTimeWindows.add(routeRequest, (timeWindow) -> {
            timeWindowToAdd = timeWindow;
        });

        // then
        assertEquals(0.0, timeWindowToAdd.getStart(), 0.01);
        assertEquals(Double.MAX_VALUE, timeWindowToAdd.getEnd(), 0.01);
    }

    @Test
    public void given_time_window_is_add() {
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