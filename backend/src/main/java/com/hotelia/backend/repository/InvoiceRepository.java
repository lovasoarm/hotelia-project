package com.hotelia.backend.repository;

import com.hotelia.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByReservationId(Long reservationId);
    boolean existsByReservationId(Long reservationId);
}