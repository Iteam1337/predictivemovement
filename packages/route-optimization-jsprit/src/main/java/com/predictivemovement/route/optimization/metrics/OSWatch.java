package com.predictivemovement.route.optimization.metrics;

import java.lang.management.ManagementFactory;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.time.Duration;

import com.sun.management.OperatingSystemMXBean;

import org.json.JSONObject;

/**
 * This class measures some information about the operating environment.
 */
public class OSWatch implements Runnable {

    public JSONObject metrics;

    BinStore freeMemoryStore;
    BinStore freeSwapSpaceStore;
    BinStore systemLoadStore;
    BinStore cpuLoadStore;
    BinStore processCpuLoadStore;

    private boolean stop = false;

    public synchronized void stop() {
        stop = true;
    }

    private synchronized boolean run_thread() {
        return !stop;
    }

    @Override
    public void run() {
        try {
            // How bins work:
            // The measured interval is one second, for example: [0.2: 8, 0.3: 1] = 9
            // intervals/seconds were measured (8+1) with a CPU load of 8 times between
            // 20%-30% and 1 time between 30%-40%.
            freeMemoryStore = new BinStore();
            freeSwapSpaceStore = new BinStore();
            systemLoadStore = new BinStore();
            cpuLoadStore = new BinStore();
            processCpuLoadStore = new BinStore();

            metrics = new JSONObject();

            OperatingSystemMXBean operatingSystemMXBean = (OperatingSystemMXBean) ManagementFactory
                    .getOperatingSystemMXBean();

            metrics.put("version", operatingSystemMXBean.getVersion());
            metrics.put("architecture", operatingSystemMXBean.getArch());
            metrics.put("os_name", operatingSystemMXBean.getName());
            metrics.put("processors", operatingSystemMXBean.getAvailableProcessors());
            metrics.put("total_memory_size", formatBytes(operatingSystemMXBean.getTotalMemorySize()));
            metrics.put("committed_virtual_memory_size",
                    formatBytes(operatingSystemMXBean.getCommittedVirtualMemorySize()));

            while (run_thread()) {
                // Free Memory
                freeMemoryStore.increment(formatBytes(operatingSystemMXBean.getFreeMemorySize()));

                // Free Swap Space
                freeSwapSpaceStore.increment(formatBytes(operatingSystemMXBean.getFreeSwapSpaceSize()));

                // System Load Average
                double systemLoadRound = round(10, operatingSystemMXBean.getSystemLoadAverage());
                systemLoadStore.increment("" + systemLoadRound);

                // CPU Load
                double cpuLoadRound = round(10, operatingSystemMXBean.getCpuLoad());
                cpuLoadStore.increment("" + cpuLoadRound);

                // Process CPU Load
                double processCpuLoadRound = round(10, operatingSystemMXBean.getProcessCpuLoad());
                processCpuLoadStore.increment("" + processCpuLoadRound);

                // measure interval of 1 second
                Thread.sleep(1L * 1000L);
            }

            metrics.put("free_memory", freeMemoryStore.toJsonObject());
            metrics.put("free_swap_space", freeSwapSpaceStore.toJsonObject());
            metrics.put("system_load_average", systemLoadStore.toJsonObject());
            metrics.put("process_cpu_time", formatNanos(operatingSystemMXBean.getProcessCpuTime()));
            metrics.put("cpu_load", cpuLoadStore.toJsonObject());
            metrics.put("process_cpu_load", processCpuLoadStore.toJsonObject());

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static double round(int decimals, double value) {
        return (double) Math.round(value * decimals) / decimals;
    }

    // https://programming.guide/java/formatting-byte-size-to-human-readable-format.html
    private static String formatBytes(long bytes) {
        if (-1000 < bytes && bytes < 1000) {
            return bytes + " B";
        }
        CharacterIterator ci = new StringCharacterIterator("kMGTPE");
        while (bytes <= -999_950 || bytes >= 999_950) {
            bytes /= 1000;
            ci.next();
        }
        return String.format("%.1f %cB", bytes / 1000.0, ci.current());
    }

    private static String formatNanos(long nanos) {
        Duration d = Duration.ofNanos(nanos);
        return String.format("%02d:%02d:%02d.%d", d.toHours(), d.toMinutesPart(), d.toSecondsPart(), d.toMillis());
    }
}