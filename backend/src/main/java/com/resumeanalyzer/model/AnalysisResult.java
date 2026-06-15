package com.resumeanalyzer.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalysisResult {
    private String fileName;
    private int atsScore;
    private AtsBreakdown atsBreakdown;
    private Map<String, List<String>> skillsByCategory;
    private List<String> allDetectedSkills;
    private int totalSkillsFound;
    private List<Suggestion> suggestions;
    private int wordCount;
    private List<String> detectedSections;
    private int jobMatchScore;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private boolean hasJobDescription;
}
