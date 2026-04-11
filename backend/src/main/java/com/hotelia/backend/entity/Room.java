package com.hotelia.backend.entity;

import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.enums.RoomType;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Column(nullable = false)
    private Double pricePerNight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @OneToMany(mappedBy = "room")
    private List<Reservation> reservations;

    public Room() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String roomNumber;
        private Double pricePerNight;
        private RoomType type;
        private RoomStatus status;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder pricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder type(RoomType type) { this.type = type; return this; }
        public Builder status(RoomStatus status) { this.status = status; return this; }

        public Room build() {
            Room r = new Room();
            r.id = this.id;
            r.roomNumber = this.roomNumber;
            r.pricePerNight = this.pricePerNight;
            r.type = this.type;
            r.status = this.status;
            return r;
        }
    }

    public Long getId() { return id; }
    public String getRoomNumber() { return roomNumber; }
    public Double getPricePerNight() { return pricePerNight; }
    public RoomType getType() { return type; }
    public RoomStatus getStatus() { return status; }
    public List<Reservation> getReservations() { return reservations; }

    public void setStatus(RoomStatus status) { this.status = status; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public void setType(RoomType type) { this.type = type; }
}