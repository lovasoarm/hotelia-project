package com.hotelia.backend.service;

import com.hotelia.backend.dto.response.InvoiceResponse;
import com.hotelia.backend.entity.Invoice;
import com.hotelia.backend.entity.Reservation;
import com.hotelia.backend.enums.ReservationStatus;
import com.hotelia.backend.exception.BadRequestException;
import com.hotelia.backend.exception.ResourceNotFoundException;
import com.hotelia.backend.repository.InvoiceRepository;
import com.hotelia.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ReservationRepository reservationRepository;

    public List<InvoiceResponse> findAll() {
        return invoiceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public InvoiceResponse generate(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));

        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new BadRequestException("La réservation doit être COMPLETED");
        }

        if (invoiceRepository.existsByReservationId(reservationId)) {
            throw new BadRequestException("Une facture existe déjà pour cette réservation");
        }

        long nights = ChronoUnit.DAYS.between(
                reservation.getCheckInDate(),
                reservation.getCheckOutDate()
        );
        double total = nights * reservation.getRoom().getPricePerNight();

        Invoice invoice = Invoice.builder()
                .reservation(reservation)
                .totalAmount(total)
                .build();

        return toResponse(invoiceRepository.save(invoice));
    }

    public InvoiceResponse markAsPaid(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));

        if (invoice.getIsPaid()) {
            throw new BadRequestException("Cette facture est déjà payée");
        }

        invoice.setIsPaid(true);
        return toResponse(invoiceRepository.save(invoice));
    }

    private InvoiceResponse toResponse(Invoice inv) {
        long nights = ChronoUnit.DAYS.between(
                inv.getReservation().getCheckInDate(),
                inv.getReservation().getCheckOutDate()
        );

        return InvoiceResponse.builder()
                .id(inv.getId())
                .clientName(inv.getReservation().getClient().getFirstName()
                        + " " + inv.getReservation().getClient().getLastName())
                .roomNumber(inv.getReservation().getRoom().getRoomNumber())
                .numberOfNights(nights)
                .totalAmount(inv.getTotalAmount())
                .issueDate(inv.getIssueDate())
                .isPaid(inv.getIsPaid())
                .build();
    }
}