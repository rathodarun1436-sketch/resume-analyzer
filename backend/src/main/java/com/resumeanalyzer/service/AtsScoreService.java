package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AtsBreakdown;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AtsScoreService {

    private static final List<String> ACTION_VERBS = List.of(
        "achieved", "accelerated", "architected", "automated", "boosted", "built",
        "championed", "collaborated", "configured", "coordinated", "created",
        "decreased", "delivered", "deployed", "designed", "developed", "directed",
        "drove", "enhanced", "established", "executed", "expanded", "generated",
        "implemented", "improved", "increased", "initiated", "integrated", "launched",
        "led", "managed", "mentored", "migrated", "modernized", "optimized",
        "orchestrated", "oversaw", "reduced", "refactored", "resolved", "scaled",
        "spearheaded", "streamlined", "transformed", "upgraded", "engineered"
    );

    public AtsBreakdown calculateBreakdown(String text) {
        String lower = text.toLowerCase();
        return AtsBreakdown.builder()
            .contactInfo(scoreContactInfo(lower))
            .summary(scoreSummary(lower))
            .workExperience(scoreExperience(lower))
            .education(scoreEducation(lower))
            .skills(scoreSkillsSection(lower))
            .actionVerbs(scoreActionVerbs(lower))
            .measurableAchievements(scoreAchievements(lower))
            .wordCount(scoreWordCount(text))
            .jobMatch(0)
            .build();
    }

    public int calculateTotal(AtsBreakdown b) {
        return b.getContactInfo() + b.getSummary() + b.getWorkExperience()
            + b.getEducation() + b.getSkills() + b.getActionVerbs()
            + b.getMeasurableAchievements() + b.getWordCount() + b.getJobMatch();
    }

    public List<String> detectSections(String text) {
        String lower = text.toLowerCase();
        List<String> sections = new ArrayList<>();
        if (lower.contains("@") || lower.contains("linkedin") || lower.contains("phone")) sections.add("Contact Info");
        if (lower.contains("summary") || lower.contains("objective") || lower.contains("profile")) sections.add("Summary");
        if (lower.contains("experience") || lower.contains("employment")) sections.add("Work Experience");
        if (lower.contains("education") || lower.contains("degree") || lower.contains("university")) sections.add("Education");
        if (lower.contains("skills") || lower.contains("competencies") || lower.contains("technologies")) sections.add("Skills");
        if (lower.contains("projects") || lower.contains("portfolio")) sections.add("Projects");
        if (lower.contains("certif")) sections.add("Certifications");
        return sections;
    }

    private int scoreContactInfo(String lower) {
        int score = 0;
        if (lower.matches("(?s).*[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}.*")) score += 4;
        if (lower.matches("(?s).*[+]?[0-9]{1,3}[\\s.\\-]?[(]?[0-9]{3}[)]?[\\s.\\-]?[0-9]{3}[\\s.\\-]?[0-9]{4}.*")) score += 3;
        if (lower.contains("linkedin")) score += 2;
        if (lower.contains("github") || lower.contains("portfolio")) score += 1;
        return Math.min(score, 10);
    }

    private int scoreSummary(String lower) {
        return (lower.contains("summary") || lower.contains("objective")
            || lower.contains("profile") || lower.contains("about")) ? 5 : 0;
    }

    private int scoreExperience(String lower) {
        return (lower.contains("experience") || lower.contains("employment")
            || lower.contains("work history") || lower.contains("career")) ? 10 : 0;
    }

    private int scoreEducation(String lower) {
        return (lower.contains("education") || lower.contains("degree")
            || lower.contains("university") || lower.contains("college")
            || lower.contains("bachelor") || lower.contains("master")
            || lower.contains("b.sc") || lower.contains("m.sc")) ? 10 : 0;
    }

    private int scoreSkillsSection(String lower) {
        return (lower.contains("skills") || lower.contains("competencies")
            || lower.contains("expertise") || lower.contains("technologies")) ? 10 : 0;
    }

    private int scoreActionVerbs(String lower) {
        long count = ACTION_VERBS.stream().filter(lower::contains).count();
        if (count >= 15) return 15;
        if (count >= 10) return 12;
        if (count >= 6)  return 9;
        if (count >= 3)  return 5;
        return 0;
    }

    private int scoreAchievements(String lower) {
        boolean hasMetrics = lower.matches("(?s).*\\d+%.*")
            || lower.matches("(?s).*\\$[\\d,]+.*")
            || lower.matches("(?s).*(increased|decreased|reduced|improved|saved|generated).*\\d+.*");
        return hasMetrics ? 10 : 0;
    }

    private int scoreWordCount(String text) {
        int words = text.trim().isEmpty() ? 0 : text.split("\\s+").length;
        if (words >= 400 && words <= 700) return 10;
        if (words >= 300) return 8;
        if (words >= 200) return 6;
        if (words > 700 && words <= 1000) return 8;
        if (words > 1000) return 5;
        return 2;
    }
}
