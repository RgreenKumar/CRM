package com.salescrm.controller;

import com.salescrm.entity.PipelineStage;
import com.salescrm.repository.PipelineStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*", maxAge = 3600)
@SuppressWarnings("null")
public class PipelineStageController {

    @Autowired
    private PipelineStageRepository stageRepository;

    @GetMapping
    public List<PipelineStage> getAllStages() {
        return stageRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping
    public PipelineStage createStage(@RequestBody PipelineStage stage) {
        if (stage.getSortOrder() == null) {
            long count = stageRepository.count();
            stage.setSortOrder((int) count);
        }
        return stageRepository.save(stage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PipelineStage> updateStage(@PathVariable Long id, @RequestBody PipelineStage stageDetails) {
        Optional<PipelineStage> stageOpt = stageRepository.findById(id);
        if (stageOpt.isPresent()) {
            PipelineStage stage = stageOpt.get();
            stage.setName(stageDetails.getName());
            stage.setColor(stageDetails.getColor());
            if (stageDetails.getSortOrder() != null) {
                stage.setSortOrder(stageDetails.getSortOrder());
            }
            if (stageDetails.getStatus() != null) {
                stage.setStatus(stageDetails.getStatus());
            }
            return ResponseEntity.ok(stageRepository.save(stage));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStage(@PathVariable Long id) {
        if (stageRepository.existsById(id)) {
            stageRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
