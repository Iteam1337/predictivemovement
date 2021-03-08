package com.predictivemovement.route.optimization;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Random;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class generates random booking requests 'quick and dirty'.
 */
public class TryGenerateRequests {

    String OSRM_URL = "https://osrm.iteamdev.io";
    // String OSRM_URL = "http://router.project-osrm.org";

    public static void main(final String args[]) throws Exception {
        TryGenerateRequests generator = new TryGenerateRequests();

        // v = vehicle numbers; b = booking numbers

        // increasing vehicles
        // generator.generateRequest("req_v68_b1", 68, 1);
        // generator.generateRequest("req_v137_b1", 137, 1);
        // generator.generateRequest("req_v205_b1", 205, 1);
        // generator.generateRequest("req_v274_b1", 274, 1);

        // increasing bookings
        // generator.generateRequest("req_v1_b34", 1, 34);
        // generator.generateRequest("req_v1_b68", 1, 68);
        // generator.generateRequest("req_v1_b102", 1, 102);
        // generator.generateRequest("req_v1_b137", 1, 137);

        // mixed
        generator.generateRequest("req_v1_b1", 1, 1);
        // generator.generateRequest("req_v34_b120", 34, 120);
        // generator.generateRequest("req_v68_b103", 68, 103);
        // generator.generateRequest("req_v136_b69", 136, 69);
        // generator.generateRequest("req_v205_b35", 205, 35);
    }

    void generateRequest(String filename, int vehicleNr, int booking_nr)
            throws IOException, JSONException, InterruptedException {
        JSONObject request = new JSONObject();

        String locations = createRandomLocations(vehicleNr, booking_nr);
        request.put("matrix", generateMatrix(locations));
        request.put("vehicles", generateVehicles(vehicleNr, request));
        request.put("bookings", generateBookings(booking_nr, request, vehicleNr));

        System.out.println("generated " + filename);
        writeJsonFile(request, filename);
    }

    private String createRandomLocations(int vehicleNr, int booking_nr) {
        // lon/lat around Stockholm
        double lonRangeMin = 17.0;
        double lonRangeMax = 18.0;

        double latRangeMin = 59.0;
        double latRangeMax = 60.0;

        StringBuffer buffer = new StringBuffer();

        // 2 * booking for pickup and delivery
        int numberOfLocations = vehicleNr + (booking_nr * 2);
        for (int i = 0; i < numberOfLocations; i++) {
            double lon = createRandom(lonRangeMin, lonRangeMax);
            double lat = createRandom(latRangeMin, latRangeMax);

            buffer.append(lon + "," + lat + ";");
        }

        buffer.deleteCharAt(buffer.length() - 1);
        return buffer.toString();
    }

    private double createRandom(double rangeMin, double rangeMax) {
        Random random = new Random();
        double location = rangeMin + (rangeMax - rangeMin) * random.nextDouble();
        location = Math.round(location * 1000000.0) / 1000000.0;
        return location;
    }

    private JSONObject generateMatrix(String locationsStr) throws IOException, InterruptedException {
        JSONObject matrix = new JSONObject();

        HttpClient client = HttpClient.newHttpClient();
        String url = OSRM_URL + "/table/v1/driving/" + locationsStr;
        HttpRequest request = HttpRequest.newBuilder(URI.create(url)).header("accept", "application/json")
                .timeout(Duration.ofSeconds(60)).build();
        var response = client.send(request, BodyHandlers.ofString());

        System.out.println(response.statusCode());
        // System.out.println(response.body());

        matrix = new JSONObject(response.body());
        return matrix;
    }

    private JSONArray generateVehicles(int vehicleNr, JSONObject request) throws IOException, InterruptedException {
        JSONArray vehicles = new JSONArray();
        JSONArray locations = request.getJSONObject("matrix").getJSONArray("sources");

        for (int i = 0; i < vehicleNr; i++) {
            System.out.println("Creating vehicle number " + (i + 1) + " of " + vehicleNr);

            JSONObject vehicle = new JSONObject();
            vehicle.put("id", "vehicle-" + i);

            JSONObject source = locations.getJSONObject(i);
            JSONArray location = source.getJSONArray("location");

            JSONObject startAddress = new JSONObject();
            startAddress.put("lon", location.getDouble(0));
            startAddress.put("lat", location.getDouble(1));
            startAddress.put("hint", source.getString("hint"));
            vehicle.put("start_address", startAddress);

            // JSONObject endAddress = new JSONObject();
            // endAddress.put("lon", 21.92567);
            // endAddress.put("lat", 65.6335);
            vehicle.put("end_address", startAddress);

            vehicles.put(vehicle);
        }

        return vehicles;
    }

    private JSONArray generateBookings(int booking_nr, JSONObject request, int vehicleNr)
            throws IOException, InterruptedException {
        JSONArray bookings = new JSONArray();
        JSONArray locations = request.getJSONObject("matrix").getJSONArray("sources");

        for (int i = 0; i < booking_nr; i++) {
            System.out.println("Creating booking number " + (i + 1) + " of " + booking_nr);

            JSONObject booking = new JSONObject();
            booking.put("id", "booking-" + i);

            // pickup
            JSONObject source = locations.getJSONObject(i + vehicleNr);
            JSONArray location = source.getJSONArray("location");

            JSONObject pickup = new JSONObject();
            pickup.put("lon", location.getDouble(0));
            pickup.put("lat", location.getDouble(1));
            pickup.put("hint", source.getString("hint"));
            booking.put("pickup", pickup);

            // delivery
            source = locations.getJSONObject((vehicleNr + (2 * booking_nr) - 1) - i);
            location = source.getJSONArray("location");

            JSONObject delivery = new JSONObject();
            delivery.put("lon", location.getDouble(0));
            delivery.put("lat", location.getDouble(1));
            delivery.put("hint", source.getString("hint"));
            booking.put("delivery", delivery);

            bookings.put(booking);
        }

        return bookings;
    }

    private void writeJsonFile(JSONObject request, String filename) throws IOException {
        Path filepath = Paths.get("src/test/resources/metrics/" + filename + ".json");
        Files.write(filepath, request.toString().getBytes());
    }
}
