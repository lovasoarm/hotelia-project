package com.hotelia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private LocalDateTime issueDate;

    @Column(nullable = false)
    private Boolean isPaid;

    public Invoice() {}

    @PrePersist
    protected void onCreate() {
        this.issueDate = LocalDateTime.now();
        this.isPaid = false;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Reservation reservation;
        private Double totalAmount;

        public Builder reservation(Reservation reservation) { this.reservation = reservation; return this; }
        public Builder totalAmount(Double totalAmount) { this.totalAmount = totalAmount; return this; }

        public Invoice build() {
            Invoice inv = new Invoice();
            inv.reservation = this.reservation;
            inv.totalAmount = this.totalAmount;
            return inv;
        }
    }

    public Long getId() { return id; }
    public Reservation getReservation() { return reservation; }
    public Double getTotalAmount() { return totalAmount; }
    public LocalDateTime getIssueDate() { return issueDate; }
    public Boolean getIsPaid() { return isPaid; }

    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }
}