package com.salescrm.controller;

import com.salescrm.entity.Contact;
import com.salescrm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;
import com.salescrm.repository.LeadRepository;
import com.salescrm.entity.Lead;

@RestController
@RequestMapping("/api/contacts")
@SuppressWarnings("all")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private LeadRepository leadRepository;

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @PostMapping
    public Contact createContact(@RequestBody @NonNull Contact contact) {
        return contactRepository.save(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable @NonNull Long id, @RequestBody @NonNull Contact contactDetails) {
        Optional<Contact> optionalContact = contactRepository.findById(id);
        if (optionalContact.isPresent()) {
            Contact contact = optionalContact.get();
            String oldEmail = contact.getEmail();
            
            contact.setName(contactDetails.getName());
            contact.setEmail(contactDetails.getEmail());
            contact.setPhone(contactDetails.getPhone());
            contact.setCompany(contactDetails.getCompany());
            contact.setDesignation(contactDetails.getDesignation());
            Contact updatedContact = contactRepository.save(contact);
            
            // Also update the linked Lead if they share the same email
            if (oldEmail != null && !oldEmail.isEmpty()) {
                List<Lead> linkedLeads = leadRepository.findByEmail(oldEmail);
                for (Lead lead : linkedLeads) {
                    lead.setName(contactDetails.getName());
                    lead.setEmail(contactDetails.getEmail());
                    lead.setPhone(contactDetails.getPhone());
                    leadRepository.save(lead);
                }
            }
            
            return ResponseEntity.ok(updatedContact);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable @NonNull Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
