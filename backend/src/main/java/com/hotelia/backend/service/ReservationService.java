package com.hotelia.backend.service;

import com.hotelia.backend.dto.request.ReservationRequest;
import com.hotelia.backend.dto.response.ReservationResponse;
import com.hotelia.backend.entity.Client;
import com.hotelia.backend.entity.Reservation;
import com.hotelia.backend.entity.Room;
import com.hotelia.backend.enums.ReservationStatus;
import com.hotelia.backend.exception.BadRequestException;
import com.hotelia.backend.exception.ResourceNotFoundException;
import com.hotelia.backend.repository.ClientRepository;
import com.hotelia.backend.repository.ReservationRepository;
import com.hotelia.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;
    private final RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              ClientRepository clientRepository,
                              RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.clientRepository = clientRepository;
        this.roomRepository = roomRepository;
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse findById(Long id) {
        return toResponse(getReservationOrThrow(id));
    }

    public ReservationResponse create(ReservationRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("La date de départ doit être après l'arrivée");
        }

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Chambre non trouvée"));

        Reservation reservation = Reservation.builder()
                .client(client)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .build();

        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationResponse confirm(Long id) {
        Reservation r = getReservationOrThrow(id);
        if (r.getStatus() != ReservationStatus.PENDING) {
            throw new BadRequestException("Seule une réservation PENDING peut être confirmée");
        }
        r.setStatus(ReservationStatus.CONFIRMED);
        return toResponse(reservationRepository.save(r));
    }

    public ReservationResponse cancel(Long id) {
        Reservation r = getReservationOrThrow(id);
        if (r.getStatus() == ReservationStatus.COMPLETED) {
            throw new BadRequestException("Impossible d'annuler une réservation terminée");
        }
        r.setStatus(ReservationStatus.CANCELLED);
        return toResponse(reservationRepository.save(r));
    }

    public ReservationResponse complete(Long id) {
        Reservation r = getReservationOrThrow(id);
        if (r.getStatus() != ReservationStatus.CONFIRMED) {
            throw new BadRequestException("Seule une réservation CONFIRMED peut être terminée");
        }
        r.setStatus(ReservationStatus.COMPLETED);
        return toResponse(reservationRepository.save(r));
    }

    private Reservation getReservationOrThrow(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));
    }

    private ReservationResponse toResponse(Reservation r) {
        long nights = ChronoUnit.DAYS.between(r.getCheckInDate(), r.getCheckOutDate());
        double total = nights * r.getRoom().getPricePerNight();

        return ReservationResponse.builder()
                .id(r.getId())
                .clientName(r.getClient().getFirstName() + " " + r.getClient().getLastName())
                .roomNumber(r.getRoom().getRoomNumber())
                .checkInDate(r.getCheckInDate())
                .checkOutDate(r.getCheckOutDate())
                .numberOfNights(nights)
                .totalAmount(total)
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}