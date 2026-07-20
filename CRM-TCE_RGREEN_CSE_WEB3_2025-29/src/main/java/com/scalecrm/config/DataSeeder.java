package com.scalecrm.config;

import com.scalecrm.entity.User;
import com.scalecrm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            String defaultPassword = passwordEncoder.encode("password");
            
            // Seed Admin User (logged-in user in mockups)
            User adminUser = new User("admin@salescrm.com", defaultPassword, "Admin", "Admin User", "Active");
            userRepository.save(adminUser);

            // Seed users from the User Management mockup table
            userRepository.save(new User("john.doe@example.com", defaultPassword, "Admin", "John Doe", "Active"));
            userRepository.save(new User("sarah.smith@example.com", defaultPassword, "Sales Manager", "Sarah Smith", "Active"));
            userRepository.save(new User("mike.johnson@example.com", defaultPassword, "Sales User", "Mike Johnson", "Active"));
            userRepository.save(new User("emily.davis@example.com", defaultPassword, "Sales User", "Emily Davis", "Inactive"));
            userRepository.save(new User("david.brown@example.com", defaultPassword, "Sales User", "David Brown", "Active"));
            
            System.out.println("==================================================");
            System.out.println("Database successfully seeded with default CRM users.");
            System.out.println("All users seeded with default password: password");
            System.out.println("==================================================");
        }
    }
}
