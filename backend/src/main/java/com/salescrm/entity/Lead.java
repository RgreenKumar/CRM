package com.salescrm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String source;
    private String status;
    private String assignedManager;
    private String assignedSalesperson;

    public Lead() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedManager() { return assignedManager; }
    public void setAssignedManager(String assignedManager) { this.assignedManager = assignedManager; }

    public String getAssignedSalesperson() { return assignedSalesperson; }
    public void setAssignedSalesperson(String assignedSalesperson) { this.assignedSalesperson = assignedSalesperson; }
}
