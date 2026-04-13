package com.hotelia.backend.controller;

import com.hotelia.backend.dto.request.LoginRequest;
import com.hotelia.backend.dto.response.AuthResponse;
import com.hotelia.backend.entity.User;
import com.hotelia.backend.enums.Role;
import com.hotelia.backend.repository.UserRepository;
import com.hotelia.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/init")
    public ResponseEntity<String> init() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User receptionist = new User();
        receptionist.setUsername("receptionist");
        receptionist.setPassword(passwordEncoder.encode("recep123"));
        receptionist.setRole(Role.RECEPTIONIST);
        userRepository.save(receptionist);

        return ResponseEntity.ok("Users créés avec succès");
    }
}