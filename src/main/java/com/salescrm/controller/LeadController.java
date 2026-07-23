package com.salescrm.controller;

import com.salescrm.entity.Lead;
import com.salescrm.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/leads")
@SuppressWarnings("all")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @PostMapping
    public Lead createLead(@RequestBody @NonNull Lead lead) {
        return leadRepository.save(lead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable @NonNull Long id, @RequestBody @NonNull Lead leadDetails) {
        Optional<Lead> optionalLead = leadRepository.findById(id);
        if (optionalLead.isPresent()) {
            Lead lead = optionalLead.get();
            lead.setName(leadDetails.getName());
            lead.setEmail(leadDetails.getEmail());
            lead.setPhone(leadDetails.getPhone());
            lead.setSource(leadDetails.getSource());
            lead.setStatus(leadDetails.getStatus());
            lead.setAssignedTo(leadDetails.getAssignedTo());
            return ResponseEntity.ok(leadRepository.save(lead));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable @NonNull Long id) {
        if (leadRepository.existsById(id)) {
            leadRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
