package com.scalecrm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // e.g. ROLE_USER

    @Column(length = 10)
    private String otp;

    @Column
    private java.time.LocalDateTime otpExpiry;

    @Column(name = "full_name")
    private String fullName;

    @Column(nullable = false)
    private String status = "Active"; // e.g. Active, Inactive

    public User() {}
    
    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = "Active";
    }

    public User(String email, String password, String role, String fullName, String status) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public java.time.LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(java.time.LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }
}
