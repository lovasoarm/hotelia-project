package com.hotelia.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReservationRequest {

    @NotNull(message = "Client obligatoire")
    private Long clientId;

    @NotNull(message = "Chambre obligatoire")
    private Long roomId;

    @NotNull(message = "Date d'arrivée obligatoire")
    private LocalDate checkInDate;

    @NotNull(message = "Date de départ obligatoire")
    private LocalDate checkOutDate;

    public Long getClientId() { return clientId; }
    public Long getRoomId() { return roomId; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }

    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
}