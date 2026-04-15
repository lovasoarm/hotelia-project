package com.hotelia.backend.service;

import com.hotelia.backend.dto.response.StatsResponse;
import com.hotelia.backend.enums.ReservationStatus;
import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final ClientRepository clientRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final InvoiceRepository invoiceRepository;

    public StatsService(ClientRepository clientRepository,
                        RoomRepository roomRepository,
                        ReservationRepository reservationRepository,
                        InvoiceRepository invoiceRepository) {
        this.clientRepository = clientRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public StatsResponse getStats() {
        double totalRevenue = invoiceRepository.findAll()
                .stream()
                .filter(i -> i.getIsPaid())
                .mapToDouble(i -> i.getTotalAmount())
                .sum();

        return StatsResponse.builder()
                .totalClients(clientRepository.count())
                .totalRooms(roomRepository.count())
                .totalReservations(reservationRepository.count())
                .totalInvoices(invoiceRepository.count())
                .pendingReservations(reservationRepository.findByStatus(ReservationStatus.PENDING).size())
                .confirmedReservations(reservationRepository.findByStatus(ReservationStatus.CONFIRMED).size())
                .availableRooms(roomRepository.findByStatus(RoomStatus.AVAILABLE).size())
                .totalRevenue(totalRevenue)
                .build();
    }
}