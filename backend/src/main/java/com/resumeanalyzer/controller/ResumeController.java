package com.resumeanalyzer.controller;

import com.resumeanalyzer.model.AnalysisResult;
import com.resumeanalyzer.service.ResumeAnalysisService;
import com.resumeanalyzer.service.SkillExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeAnalysisService analysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResult> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!name.endsWith(".pdf") && !name.endsWith(".docx") && !name.endsWith(".doc")) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.ok(analysisService.analyze(file, jobDescription));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/skills-catalog")
    public ResponseEntity<Map<String, List<String>>> skillsCatalog() {
        return ResponseEntity.ok(SkillExtractionService.getSkillCategories());
    }
}
