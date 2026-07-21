package com.salescrm.controller;

import com.salescrm.entity.Deal;
import com.salescrm.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    @Autowired
    private DealRepository repository;

    @GetMapping
    public List<Deal> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Deal create(@RequestBody @NonNull Deal entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Deal update(@PathVariable @NonNull Long id, @RequestBody @NonNull Deal entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
    }
}
