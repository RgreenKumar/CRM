package com.scalecrm.controller;

import com.scalecrm.entity.User;
import com.scalecrm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userDetails) {
        String email = userDetails.get("email");
        String name = userDetails.get("name");
        String role = userDetails.get("role");
        String status = userDetails.get("status");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is required"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is already registered"));
        }

        // Default password for users created via user management
        String defaultPassword = passwordEncoder.encode("password");
        User newUser = new User(email, defaultPassword, role != null ? role : "Sales User", name != null ? name : "", status != null ? status : "Active");
        userRepository.save(newUser);

        return ResponseEntity.ok(newUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        String email = userDetails.get("email");
        String name = userDetails.get("name");
        String role = userDetails.get("role");
        String status = userDetails.get("status");

        // If email is being changed, check if it's already taken
        if (email != null && !email.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is already registered"));
            }
            user.setEmail(email);
        }

        if (name != null) {
            user.setFullName(name);
        }
        if (role != null) {
            user.setRole(role);
        }
        if (status != null) {
            user.setStatus(status);
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        userRepository.delete(userOpt.get());
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
