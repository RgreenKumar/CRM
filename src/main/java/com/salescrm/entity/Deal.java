package com.salescrm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "deals")
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String contact;
    private String value;
    private String stage;
    private String status;
    private String closeDate;
    
    private String assignedTo;

    public Deal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCloseDate() { return closeDate; }
    public void setCloseDate(String closeDate) { this.closeDate = closeDate; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
}
