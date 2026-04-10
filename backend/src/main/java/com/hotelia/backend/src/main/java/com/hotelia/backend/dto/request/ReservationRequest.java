package com.hotelia.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequest {
    @NotNull(message = "Client obligatoire")
    private Long clientId;

    @NotNull(message = "Chambre obligatoire")
    private Long roomId;

    @NotNull(message = "Date d'arrivée obligatoire")
    private LocalDate checkInDate;

    @NotNull(message = "Date de départ obligatoire")
    private LocalDate checkOutDate;
}