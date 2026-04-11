package com.hotelia.backend.dto.request;

import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RoomRequest {

    @NotBlank(message = "Numéro de chambre obligatoire")
    private String roomNumber;

    @NotNull(message = "Type obligatoire")
    private RoomType type;

    @NotNull(message = "Prix obligatoire")
    @Positive(message = "Prix doit être positif")
    private Double pricePerNight;

    private RoomStatus status;

    public String getRoomNumber() { return roomNumber; }
    public RoomType getType() { return type; }
    public Double getPricePerNight() { return pricePerNight; }
    public RoomStatus getStatus() { return status; }

    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public void setType(RoomType type) { this.type = type; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public void setStatus(RoomStatus status) { this.status = status; }
}