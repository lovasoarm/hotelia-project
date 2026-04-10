package com.hotelia.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponse {
    private Long id;
    private String clientName;
    private String roomNumber;
    private Long numberOfNights;
    private Double totalAmount;
    private LocalDateTime issueDate;
    private Boolean isPaid;
}