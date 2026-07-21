package com.salescrm.controller;

import com.salescrm.entity.Lead;
import com.salescrm.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadRepository repository;

    @GetMapping
    public List<Lead> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Lead create(@RequestBody @NonNull Lead entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Lead update(@PathVariable @NonNull Long id, @RequestBody @NonNull Lead entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
    }
}
