package com.hotelia.backend.dto.response;

import com.hotelia.backend.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private String clientName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long numberOfNights;
    private Double totalAmount;
    private ReservationStatus status;
    private LocalDateTime createdAt;
}