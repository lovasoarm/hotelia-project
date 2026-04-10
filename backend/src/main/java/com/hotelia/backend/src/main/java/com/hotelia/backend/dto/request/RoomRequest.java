package com.hotelia.backend.dto.request;

import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RoomRequest {
    @NotBlank(message = "Numéro de chambre obligatoire")
    private String roomNumber;

    @NotNull(message = "Type obligatoire")
    private RoomType type;

    @NotNull(message = "Prix obligatoire")
    @Positive(message = "Prix doit être positif")
    private Double pricePerNight;

    private RoomStatus status;
}