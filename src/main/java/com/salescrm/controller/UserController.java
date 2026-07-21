package com.salescrm.controller;

import com.salescrm.entity.User;
import com.salescrm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public User create(@RequestBody @NonNull User entity) {
        if (entity.getPassword() == null || entity.getPassword().isEmpty()) {
            entity.setPassword(passwordEncoder.encode("password123")); // Default password
        } else {
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        }
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable @NonNull Long id, @RequestBody @NonNull User entity) {
        Optional<User> existingOpt = repository.findById(id);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            existing.setName(entity.getName());
            existing.setEmail(entity.getEmail());
            existing.setRole(entity.getRole());
            existing.setStatus(entity.getStatus());
            // Intentionally not updating password here unless provided
            if (entity.getPassword() != null && !entity.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(entity.getPassword()));
            }
            return repository.save(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
    }
}
