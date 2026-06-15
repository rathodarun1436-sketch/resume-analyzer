package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AtsBreakdown;
import com.resumeanalyzer.model.Suggestion;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SuggestionService {

    public List<Suggestion> generate(AtsBreakdown b, Map<String, List<String>> skills,
                                     int jobMatchScore, boolean hasJobDesc) {
        List<Suggestion> list = new ArrayList<>();

        if (b.getContactInfo() < 7) {
            list.add(Suggestion.builder()
                .category("Contact Info").priority("HIGH")
                .title("Complete Your Contact Information")
                .description("Recruiters must reach you. Include email, phone, and LinkedIn.")
                .examples(List.of("john.doe@email.com", "+1 (555) 123-4567", "linkedin.com/in/johndoe"))
                .build());
        }

        if (b.getSummary() == 0) {
            list.add(Suggestion.builder()
                .category("Content").priority("MEDIUM")
                .title("Add a Professional Summary")
                .description("A 3–4 sentence summary at the top lets recruiters grasp your value in seconds.")
                .examples(List.of(
                    "Results-driven Software Engineer with 5+ years building scalable APIs...",
                    "Full-stack developer specialising in React & Spring Boot..."))
                .build());
        }

        if (b.getActionVerbs() < 9) {
            list.add(Suggestion.builder()
                .category("Language").priority("HIGH")
                .title("Use Stronger Action Verbs")
                .description("Begin each bullet with a power verb to convey ownership and impact.")
                .examples(List.of("Spearheaded", "Architected", "Optimized", "Orchestrated", "Streamlined"))
                .build());
        }

        if (b.getMeasurableAchievements() == 0) {
            list.add(Suggestion.builder()
                .category("Impact").priority("HIGH")
                .title("Quantify Your Achievements")
                .description("Numbers make accomplishments credible. Add percentages, counts, and dollar figures.")
                .examples(List.of(
                    "Reduced API latency by 40%",
                    "Led a team of 6 engineers",
                    "Increased test coverage from 45% to 87%"))
                .build());
        }

        if (b.getWordCount() < 6) {
            list.add(Suggestion.builder()
                .category("Length").priority("MEDIUM")
                .title("Expand Your Resume Content")
                .description("Aim for 400–700 words. Thin resumes are filtered out by ATS before a human reads them.")
                .examples(List.of("Elaborate on key responsibilities", "Add project descriptions", "Include volunteer work"))
                .build());
        }

        int totalSkills = skills.values().stream().mapToInt(List::size).sum();
        if (totalSkills < 8) {
            list.add(Suggestion.builder()
                .category("Skills").priority("MEDIUM")
                .title("Expand Your Skills Section")
                .description("Recruiters scan the skills section first. List both technical tools and soft skills explicitly.")
                .examples(List.of("Create a dedicated 'Technical Skills' section", "Include certifications", "Add frameworks and tools"))
                .build());
        }

        if (hasJobDesc && jobMatchScore < 50) {
            list.add(Suggestion.builder()
                .category("Keywords").priority("HIGH")
                .title("Tailor Keywords to the Job Description")
                .description("Your resume matches only " + jobMatchScore + "% of job description terms. Mirror exact phrases from the posting.")
                .examples(List.of("Use exact technology names from the JD", "Add required certifications", "Include role-specific terminology"))
                .build());
        }

        if (b.getEducation() == 0) {
            list.add(Suggestion.builder()
                .category("Structure").priority("LOW")
                .title("Add an Education Section")
                .description("Even experienced engineers should list their highest degree and institution.")
                .examples(List.of("B.S. Computer Science, MIT, 2018", "AWS Certified Solutions Architect"))
                .build());
        }

        list.sort(Comparator.comparingInt(s -> switch (s.getPriority()) {
            case "HIGH" -> 0;
            case "MEDIUM" -> 1;
            default -> 2;
        }));

        return list;
    }
}
