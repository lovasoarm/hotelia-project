package com.hotelia.backend.service;

import com.hotelia.backend.dto.request.RoomRequest;
import com.hotelia.backend.dto.response.RoomResponse;
import com.hotelia.backend.entity.Room;
import com.hotelia.backend.enums.RoomStatus;
import com.hotelia.backend.exception.BadRequestException;
import com.hotelia.backend.exception.ResourceNotFoundException;
import com.hotelia.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponse> findAll() {
        return roomRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse findById(Long id) {
        return toResponse(getRoomOrThrow(id));
    }

    public RoomResponse create(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new BadRequestException("Numéro de chambre déjà utilisé");
        }

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .type(request.getType())
                .pricePerNight(request.getPricePerNight())
                .status(RoomStatus.AVAILABLE)
                .build();

        return toResponse(roomRepository.save(room));
    }

    public RoomResponse updateStatus(Long id, RoomStatus status) {
        Room room = getRoomOrThrow(id);
        room.setStatus(status);
        return toResponse(roomRepository.save(room));
    }

    public void delete(Long id) {
        Room room = getRoomOrThrow(id);

        if (room.getReservations() != null && !room.getReservations().isEmpty()) {
            throw new BadRequestException("Impossible : cette chambre a des réservations");
        }

        roomRepository.delete(room);
    }

    private Room getRoomOrThrow(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chambre non trouvée"));
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .pricePerNight(room.getPricePerNight())
                .type(room.getType())
                .status(room.getStatus())
                .build();
    }
}