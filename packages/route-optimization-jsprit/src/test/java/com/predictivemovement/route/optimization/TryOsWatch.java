package com.predictivemovement.route.optimization;

import com.predictivemovement.route.optimization.metrics.OSWatch;

/**
 * Try to measures some information about the operating environment.
 */
public class TryOsWatch {

    public static void main(final String args[]) throws Exception {

        // start thread to measure
        OSWatch cuWatch = new OSWatch();
        Thread thread = new Thread(cuWatch);
        thread.start();

        // try to create some fake minimal load
        try {
            for (int i = 0; i < 10; i++) {
                long start = System.currentTimeMillis();
                long count = 0l;
                for (long x = 0; x < Integer.MAX_VALUE; x++) {
                    count += 1;
                }
                long end = System.currentTimeMillis();
                System.out.println(end - start + " ms; " + count);
                Thread.sleep(1L * 1000L);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        cuWatch.stop();
        thread.join();

        System.out.println(cuWatch.metrics);
    }
}