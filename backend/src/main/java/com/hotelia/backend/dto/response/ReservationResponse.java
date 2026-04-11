package com.hotelia.backend.dto.response;

import com.hotelia.backend.enums.ReservationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {
    private Long id;
    private String clientName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long numberOfNights;
    private Double totalAmount;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String clientName;
        private String roomNumber;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Long numberOfNights;
        private Double totalAmount;
        private ReservationStatus status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder clientName(String clientName) { this.clientName = clientName; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numberOfNights(Long numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public Builder totalAmount(Double totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder status(ReservationStatus status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReservationResponse build() {
            ReservationResponse r = new ReservationResponse();
            r.id = this.id;
            r.clientName = this.clientName;
            r.roomNumber = this.roomNumber;
            r.checkInDate = this.checkInDate;
            r.checkOutDate = this.checkOutDate;
            r.numberOfNights = this.numberOfNights;
            r.totalAmount = this.totalAmount;
            r.status = this.status;
            r.createdAt = this.createdAt;
            return r;
        }
    }

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public String getRoomNumber() { return roomNumber; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public Long getNumberOfNights() { return numberOfNights; }
    public Double getTotalAmount() { return totalAmount; }
    public ReservationStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}