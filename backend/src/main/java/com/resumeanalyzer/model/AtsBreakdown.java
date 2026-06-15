package com.resumeanalyzer.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AtsBreakdown {
    private int contactInfo;        // max 10
    private int summary;            // max 5
    private int workExperience;     // max 10
    private int education;          // max 10
    private int skills;             // max 10
    private int actionVerbs;        // max 15
    private int measurableAchievements; // max 10
    private int wordCount;          // max 10
    private int jobMatch;           // max 20 (only when job description provided)
}
