package com.hotelia.backend.dto.response;

import java.time.LocalDateTime;

public class InvoiceResponse {
    private Long id;
    private String clientName;
    private String roomNumber;
    private Long numberOfNights;
    private Double totalAmount;
    private LocalDateTime issueDate;
    private Boolean isPaid;

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String clientName;
        private String roomNumber;
        private Long numberOfNights;
        private Double totalAmount;
        private LocalDateTime issueDate;
        private Boolean isPaid;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder clientName(String clientName) { this.clientName = clientName; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder numberOfNights(Long numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public Builder totalAmount(Double totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder issueDate(LocalDateTime issueDate) { this.issueDate = issueDate; return this; }
        public Builder isPaid(Boolean isPaid) { this.isPaid = isPaid; return this; }

        public InvoiceResponse build() {
            InvoiceResponse r = new InvoiceResponse();
            r.id = this.id;
            r.clientName = this.clientName;
            r.roomNumber = this.roomNumber;
            r.numberOfNights = this.numberOfNights;
            r.totalAmount = this.totalAmount;
            r.issueDate = this.issueDate;
            r.isPaid = this.isPaid;
            return r;
        }
    }

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public String getRoomNumber() { return roomNumber; }
    public Long getNumberOfNights() { return numberOfNights; }
    public Double getTotalAmount() { return totalAmount; }
    public LocalDateTime getIssueDate() { return issueDate; }
    public Boolean getIsPaid() { return isPaid; }
}