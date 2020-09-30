package com.predictivemovement.route.optimization;

import static org.junit.Assert.assertEquals;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.junit.Test;

public class VRPSettingTimeUtilsTest {

    @Test
    public void time_range_is_set_in_one_day() throws Exception {
        // given
        final JSONObject times = new JSONObject();
        times.put("earliest_start", "09:00");
        times.put("latest_end", "18:00");

        final LocalDateTime testNow = LocalDateTime.now().withHour(6).withMinute(0).withSecond(0).withNano(0);
        final VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        timeUtils.localNow = testNow;

        // when
        final VehicleStartAndEndTimes startAndEndTimes = timeUtils.getVehicleStartAndEnd(times);

        // then
        // debug(testNow, startAndEndTimes);
        assertEquals(" 3 hours expected", 10800.0, startAndEndTimes.earliestStart, 0.001);
        assertEquals("12 hours expected", 43200.0, startAndEndTimes.latestEnd, 0.001);
    }

    @Test
    public void time_range_is_moved_to_next_day() throws Exception {
        // given
        final JSONObject times = new JSONObject();
        times.put("earliest_start", "09:00");
        times.put("latest_end", "18:00");

        final LocalDateTime testNow = LocalDateTime.now().withHour(23).withMinute(0).withSecond(0).withNano(0);
        final VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        timeUtils.localNow = testNow;

        // when
        final VehicleStartAndEndTimes startAndEndTimes = timeUtils.getVehicleStartAndEnd(times);

        // then
        // debug(testNow, startAndEndTimes);
        assertEquals("10 hours expected to start next day", 36000.0, startAndEndTimes.earliestStart, 0.001);
        assertEquals("19 hours expected to end next day  ", 68400.0, startAndEndTimes.latestEnd, 0.001);
    }

    @Test
    public void time_range_is_over_two_days() throws Exception {
        // given
        final JSONObject times = new JSONObject();
        times.put("earliest_start", "22:00");
        times.put("latest_end", "06:00");

        final LocalDateTime testNow = LocalDateTime.now().withHour(20).withMinute(0).withSecond(0).withNano(0);
        final VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        timeUtils.localNow = testNow;

        // when
        final VehicleStartAndEndTimes startAndEndTimes = timeUtils.getVehicleStartAndEnd(times);

        // then
        // debug(testNow, startAndEndTimes);
        assertEquals("2 hours expected", 7200.0, startAndEndTimes.earliestStart, 0.001);
        assertEquals("10 hours expected to end next day", 36000.0, startAndEndTimes.latestEnd, 0.001);
    }

    @Test
    public void start_is_set_to_zero_if_its_before_current_time_() throws Exception {
        // given
        final JSONObject times = new JSONObject();
        times.put("earliest_start", "22:00");
        times.put("latest_end", "06:00");

        final LocalDateTime testNow = LocalDateTime.now().withHour(23).withMinute(0).withSecond(0).withNano(0);
        final VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();
        timeUtils.localNow = testNow;

        // when
        final VehicleStartAndEndTimes startAndEndTimes = timeUtils.getVehicleStartAndEnd(times);

        // then
        // debug(testNow, startAndEndTimes);
        assertEquals("0 hours expected, it's in the past", 0.0, startAndEndTimes.earliestStart, 0.001);
        assertEquals("7 hours expected to end next day", 25200.0, startAndEndTimes.latestEnd, 0.001);
    }

    public void debug(LocalDateTime testNow, VehicleStartAndEndTimes startAndEndTimes) {
        System.out.println("Now: " + testNow);
        System.out.println("Sta: " + startAndEndTimes.earliestStartTime);
        System.out.println("Sta: " + startAndEndTimes.earliestStart);
        System.out.println("End: " + startAndEndTimes.latestEndTime);
        System.out.println("End: " + startAndEndTimes.latestEnd);
    }
}