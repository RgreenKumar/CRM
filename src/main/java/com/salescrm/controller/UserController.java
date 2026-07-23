package com.salescrm.controller;

import com.salescrm.entity.User;
import com.salescrm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

import com.salescrm.repository.LeadRepository;
import com.salescrm.repository.TaskRepository;
import com.salescrm.entity.Lead;
import com.salescrm.entity.Task;

@RestController
@RequestMapping("/api/users")
@SuppressWarnings("all")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @GetMapping("/dump")
    public List<User> dumpUsers() {
        List<User> users = userRepository.findAll();
        for (User u : users) {
            System.out.println("USER_DUMP: id=" + u.getId() + ", name=" + u.getName() + ", email=" + u.getEmail());
        }
        return users;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody @NonNull User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode("password123"));
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody @NonNull User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String oldName = user.getName();
            String newName = userDetails.getName();
            
            user.setName(newName);
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            user.setStatus(userDetails.getStatus());
            user.setManager(userDetails.getManager());
            
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            User saved = userRepository.save(user);
            
            if (oldName != null && !oldName.equals(newName)) {
                List<Lead> leads = leadRepository.findByAssignedTo(oldName);
                for (Lead l : leads) {
                    l.setAssignedTo(newName);
                    leadRepository.save(l);
                }
                List<Task> tasks = taskRepository.findByAssignedTo(oldName);
                for (Task t : tasks) {
                    t.setAssignedTo(newName);
                    taskRepository.save(t);
                }
                List<User> managedUsers = userRepository.findByManager(oldName);
                for (User u : managedUsers) {
                    u.setManager(newName);
                    userRepository.save(u);
                }
            }
            
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            String oldName = optionalUser.get().getName();
            userRepository.deleteById(id);
            
            if (oldName != null) {
                List<Lead> leads = leadRepository.findByAssignedTo(oldName);
                for (Lead l : leads) {
                    l.setAssignedTo("Unassigned");
                    leadRepository.save(l);
                }
                List<Task> tasks = taskRepository.findByAssignedTo(oldName);
                for (Task t : tasks) {
                    t.setAssignedTo("Unassigned");
                    taskRepository.save(t);
                }
                List<User> managedUsers = userRepository.findByManager(oldName);
                for (User u : managedUsers) {
                    u.setManager("");
                    userRepository.save(u);
                }
            }
            
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

