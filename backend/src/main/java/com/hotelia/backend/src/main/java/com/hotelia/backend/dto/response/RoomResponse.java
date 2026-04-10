package com.hotelia.backend.dto.response;

import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.enums.RoomType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Double pricePerNight;
    private RoomType type;
    private RoomStatus status;
}