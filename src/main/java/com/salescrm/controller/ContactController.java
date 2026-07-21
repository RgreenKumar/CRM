package com.salescrm.controller;

import com.salescrm.entity.Contact;
import com.salescrm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository repository;

    @GetMapping
    public List<Contact> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Contact create(@RequestBody @NonNull Contact entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable @NonNull Long id, @RequestBody @NonNull Contact entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
    }
}
