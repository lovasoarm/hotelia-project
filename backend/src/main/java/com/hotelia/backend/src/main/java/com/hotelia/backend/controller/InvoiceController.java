package com.hotelia.backend.controller;

import com.hotelia.backend.dto.response.InvoiceResponse;
import com.hotelia.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> findAll() {
        return ResponseEntity.ok(invoiceService.findAll());
    }

    @PostMapping("/generate/{reservationId}")
    public ResponseEntity<InvoiceResponse> generate(@PathVariable Long reservationId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generate(reservationId));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<InvoiceResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }
}