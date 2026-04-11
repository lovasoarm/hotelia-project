package com.hotelia.backend.entity;

import com.hotelia.backend.enums.ReservationStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Reservation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = ReservationStatus.PENDING;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Client client;
        private Room room;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;

        public Builder client(Client client) { this.client = client; return this; }
        public Builder room(Room room) { this.room = room; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }

        public Reservation build() {
            Reservation r = new Reservation();
            r.client = this.client;
            r.room = this.room;
            r.checkInDate = this.checkInDate;
            r.checkOutDate = this.checkOutDate;
            return r;
        }
    }

    public Long getId() { return id; }
    public Client getClient() { return client; }
    public Room getRoom() { return room; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public ReservationStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setStatus(ReservationStatus status) { this.status = status; }
}