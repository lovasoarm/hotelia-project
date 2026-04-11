package com.hotelia.backend.dto.response;

import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.enums.RoomType;

public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Double pricePerNight;
    private RoomType type;
    private RoomStatus status;

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

        public RoomResponse build() {
            RoomResponse r = new RoomResponse();
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
}