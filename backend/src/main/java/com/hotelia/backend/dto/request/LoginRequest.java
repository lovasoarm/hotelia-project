package com.hotelia.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Nom d'utilisateur obligatoire")
    private String username;

    @NotBlank(message = "Mot de passe obligatoire")
    private String password;

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
}