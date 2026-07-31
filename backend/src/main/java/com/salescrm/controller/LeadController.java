package com.salescrm.controller;

import com.salescrm.entity.Lead;
import com.salescrm.repository.LeadRepository;
import com.salescrm.entity.Deal;
import com.salescrm.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/leads")
@SuppressWarnings("all")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private DealRepository dealRepository;

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        return leadRepository.save(lead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails) {
        Optional<Lead> optionalLead = leadRepository.findById(id);
        if (optionalLead.isPresent()) {
            Lead lead = optionalLead.get();
            lead.setName(leadDetails.getName());
            lead.setEmail(leadDetails.getEmail());
            lead.setPhone(leadDetails.getPhone());
            lead.setSource(leadDetails.getSource());
            lead.setStatus(leadDetails.getStatus());
            lead.setAssignedManager(leadDetails.getAssignedManager());
            lead.setAssignedSalesperson(leadDetails.getAssignedSalesperson());
            
            Lead savedLead = leadRepository.save(lead);
            
            // Sync deal salesPerson with lead assignedSalesperson
            List<Deal> deals = dealRepository.findByContact(savedLead.getName());
            for (Deal deal : deals) {
                deal.setSalesPerson(savedLead.getAssignedSalesperson());
                dealRepository.save(deal);
            }
            
            return ResponseEntity.ok(savedLead);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        if (leadRepository.existsById(id)) {
            leadRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
