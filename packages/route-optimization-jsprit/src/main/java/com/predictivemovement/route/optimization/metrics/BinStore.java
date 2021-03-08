package com.predictivemovement.route.optimization.metrics;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

/**
 * This class is a 'bin counter'.
 */
public class BinStore {

    Map<String, Integer> bins = new HashMap<String, Integer>();

    public void increment(String bin) {
        Integer count = getValue(bin);
        count++;
        bins.put(bin, count);
    }

    private Integer getValue(String bin) {
        if (!bins.containsKey(bin)) {
            bins.put(bin, Integer.valueOf(0));
        }
        return (Integer) bins.get(bin);
    }

    public JSONObject toJsonObject() {
        JSONObject jsonBins = new JSONObject();

        for (String bin : bins.keySet()) {
            jsonBins.put(bin, bins.get(bin));
        }
        return jsonBins;
    }
}
