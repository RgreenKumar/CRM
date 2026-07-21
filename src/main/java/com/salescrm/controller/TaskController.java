package com.salescrm.controller;

import com.salescrm.entity.Task;
import com.salescrm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository repository;

    @GetMapping
    public List<Task> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Task create(@RequestBody @NonNull Task entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable @NonNull Long id, @RequestBody @NonNull Task entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
    }
}
