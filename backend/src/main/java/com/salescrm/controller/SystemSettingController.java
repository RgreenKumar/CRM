package com.salescrm.controller;

import com.salescrm.entity.SystemSetting;
import com.salescrm.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*") // Allow frontend to fetch without CORS issues (already handled in general, but good measure)
public class SystemSettingController {

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @GetMapping("/get/{key}")
    public ResponseEntity<?> getSetting(@PathVariable @NonNull String key) {
        Optional<SystemSetting> setting = systemSettingRepository.findById(key);
        if (setting.isPresent()) {
            return ResponseEntity.ok(setting.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<SystemSetting> saveSetting(@RequestBody @NonNull SystemSetting setting) {
        SystemSetting savedSetting = systemSettingRepository.save(setting);
        return ResponseEntity.ok(savedSetting);
    }
}
