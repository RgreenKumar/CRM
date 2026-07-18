package com.scalecrm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        // Mock authentication
        Map<String, Object> response = new HashMap<>();
        if ("admin@scale.crm".equals(credentials.get("email")) && "password".equals(credentials.get("password"))) {
            response.put("token", "mock-jwt-token-12345");
            response.put("user", Map.of("name", "Admin User", "role", "ADMIN"));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> userDetails) {
        // Mock signup
        return ResponseEntity.ok(Map.of("message", "User registered successfully. Please verify your email."));
    }
}
