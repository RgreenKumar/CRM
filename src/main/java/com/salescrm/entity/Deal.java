package com.salescrm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "deals")
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String contact;

    @Column
    private String value;

    @Column
    private String stage;

    @Column
    private String closeDate;

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
    public String getCloseDate() { return closeDate; }
    public void setCloseDate(String closeDate) { this.closeDate = closeDate; }
}
