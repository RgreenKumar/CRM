package com.salescrm.controller;

import com.salescrm.entity.Deal;
import com.salescrm.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deals")
@SuppressWarnings("all")
public class DealController {

    @Autowired
    private DealRepository dealRepository;

    @GetMapping
    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    @PostMapping
    public Deal createDeal(@RequestBody Deal deal) {
        return dealRepository.save(deal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id, @RequestBody Deal dealDetails) {
        Optional<Deal> optionalDeal = dealRepository.findById(id);
        if (optionalDeal.isPresent()) {
            Deal deal = optionalDeal.get();
            deal.setTitle(dealDetails.getTitle());
            deal.setContact(dealDetails.getContact());
            deal.setValue(dealDetails.getValue());
            deal.setStage(dealDetails.getStage());
            deal.setStatus(dealDetails.getStatus());
            deal.setCloseDate(dealDetails.getCloseDate());
            return ResponseEntity.ok(dealRepository.save(deal));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeal(@PathVariable Long id) {
        if (dealRepository.existsById(id)) {
            dealRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
