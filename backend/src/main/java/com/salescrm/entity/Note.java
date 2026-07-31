package com.salescrm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String linkedTo;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String date;
    private String salesPerson;

    public Note() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLinkedTo() { return linkedTo; }
    public void setLinkedTo(String linkedTo) { this.linkedTo = linkedTo; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSalesPerson() { return salesPerson; }
    public void setSalesPerson(String salesPerson) { this.salesPerson = salesPerson; }
}
