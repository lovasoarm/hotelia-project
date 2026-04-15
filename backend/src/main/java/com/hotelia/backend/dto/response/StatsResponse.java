package com.hotelia.backend.dto.response;

public class StatsResponse {
    private long totalClients;
    private long totalRooms;
    private long totalReservations;
    private long totalInvoices;
    private long pendingReservations;
    private long confirmedReservations;
    private long availableRooms;
    private double totalRevenue;

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalClients;
        private long totalRooms;
        private long totalReservations;
        private long totalInvoices;
        private long pendingReservations;
        private long confirmedReservations;
        private long availableRooms;
        private double totalRevenue;

        public Builder totalClients(long v) { this.totalClients = v; return this; }
        public Builder totalRooms(long v) { this.totalRooms = v; return this; }
        public Builder totalReservations(long v) { this.totalReservations = v; return this; }
        public Builder totalInvoices(long v) { this.totalInvoices = v; return this; }
        public Builder pendingReservations(long v) { this.pendingReservations = v; return this; }
        public Builder confirmedReservations(long v) { this.confirmedReservations = v; return this; }
        public Builder availableRooms(long v) { this.availableRooms = v; return this; }
        public Builder totalRevenue(double v) { this.totalRevenue = v; return this; }

        public StatsResponse build() {
            StatsResponse s = new StatsResponse();
            s.totalClients = this.totalClients;
            s.totalRooms = this.totalRooms;
            s.totalReservations = this.totalReservations;
            s.totalInvoices = this.totalInvoices;
            s.pendingReservations = this.pendingReservations;
            s.confirmedReservations = this.confirmedReservations;
            s.availableRooms = this.availableRooms;
            s.totalRevenue = this.totalRevenue;
            return s;
        }
    }

    public long getTotalClients() { return totalClients; }
    public long getTotalRooms() { return totalRooms; }
    public long getTotalReservations() { return totalReservations; }
    public long getTotalInvoices() { return totalInvoices; }
    public long getPendingReservations() { return pendingReservations; }
    public long getConfirmedReservations() { return confirmedReservations; }
    public long getAvailableRooms() { return availableRooms; }
    public double getTotalRevenue() { return totalRevenue; }
}