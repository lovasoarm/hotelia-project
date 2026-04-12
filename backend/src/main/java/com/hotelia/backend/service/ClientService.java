package com.hotelia.backend.service;

import com.hotelia.backend.dto.request.ClientRequest;
import com.hotelia.backend.dto.response.ClientResponse;
import com.hotelia.backend.entity.Client;
import com.hotelia.backend.exception.BadRequestException;
import com.hotelia.backend.exception.ResourceNotFoundException;
import com.hotelia.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<ClientResponse> findAll() {
        return clientRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse findById(Long id) {
        return toResponse(getClientOrThrow(id));
    }

    public ClientResponse create(ClientRequest request) {
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email déjà utilisé");
        }

        Client client = Client.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        return toResponse(clientRepository.save(client));
    }

    public ClientResponse update(Long id, ClientRequest request) {
        Client client = getClientOrThrow(id);

        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());

        return toResponse(clientRepository.save(client));
    }

    public void delete(Long id) {
        Client client = getClientOrThrow(id);

        if (client.getReservations() != null && !client.getReservations().isEmpty()) {
            throw new BadRequestException("Impossible : ce client a des réservations");
        }

        clientRepository.delete(client);
    }

    private Client getClientOrThrow(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .address(client.getAddress())
                .build();
    }
}