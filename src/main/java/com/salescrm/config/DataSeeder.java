package com.salescrm.config;

import com.salescrm.entity.PipelineStage;
import com.salescrm.repository.PipelineStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PipelineStageRepository stageRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        if (stageRepository.count() == 0) {
            List<PipelineStage> initialStages = Arrays.asList(
                    createStage("Prospecting", "#3b82f6", 0),
                    createStage("Qualification", "#eab308", 1),
                    createStage("Proposal", "#8b5cf6", 2),
                    createStage("Negotiation", "#f97316", 3),
                    createStage("Won", "#22c55e", 4)
            );
            stageRepository.saveAll(initialStages);
            System.out.println("Default pipeline stages seeded into database.");
        } else {
            // Force update existing pastel colors to vibrant colors for current DB
            List<PipelineStage> stages = stageRepository.findAll();
            for(PipelineStage s : stages) {
                if ("#dbeafe".equals(s.getColor())) s.setColor("#3b82f6");
                if ("#fef3c7".equals(s.getColor())) s.setColor("#eab308");
                if ("#e0e7ff".equals(s.getColor())) s.setColor("#8b5cf6");
                if ("#ffedd5".equals(s.getColor())) s.setColor("#f97316");
                if ("#dcfce7".equals(s.getColor())) s.setColor("#22c55e");
                if ("Closed Won".equals(s.getName())) s.setName("Won");
            }
            stageRepository.saveAll(stages);
        }
    }

    private PipelineStage createStage(String name, String color, int sortOrder) {
        PipelineStage stage = new PipelineStage();
        stage.setName(name);
        stage.setColor(color);
        stage.setSortOrder(sortOrder);
        return stage;
    }
}
