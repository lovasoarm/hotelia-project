package com.hotelia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String username;

    private String details;

    @Column(nullable = false)
    private LocalDateTime date;

    public AuditLog() {}

    @PrePersist
    protected void onCreate() {
        this.date = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getAction() { return action; }
    public String getUsername() { return username; }
    public String getDetails() { return details; }
    public LocalDateTime getDate() { return date; }
}