package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AnalysisResult;
import com.resumeanalyzer.model.AtsBreakdown;
import com.resumeanalyzer.model.Suggestion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeAnalysisService {

    private final TextExtractionService textExtraction;
    private final SkillExtractionService skillExtraction;
    private final AtsScoreService atsScore;
    private final JobMatchService jobMatch;
    private final SuggestionService suggestions;

    public AnalysisResult analyze(MultipartFile file, String jobDescription) throws Exception {
        String text = textExtraction.extractText(file);

        Map<String, List<String>> skillsByCategory = skillExtraction.extractSkillsByCategory(text);
        List<String> allSkills = skillsByCategory.values().stream()
            .flatMap(List::stream).collect(Collectors.toList());

        AtsBreakdown breakdown = atsScore.calculateBreakdown(text);

        boolean hasJobDesc = jobDescription != null && !jobDescription.isBlank();
        int matchScore = 0;
        List<String> matched = List.of();
        List<String> missing = List.of();

        if (hasJobDesc) {
            matchScore = jobMatch.calculateMatchScore(text, jobDescription);
            matched  = jobMatch.getMatchedKeywords(text, jobDescription);
            missing  = jobMatch.getMissingKeywords(text, jobDescription);
            breakdown.setJobMatch((int) Math.round(matchScore * 0.20));
        }

        int total = Math.min(atsScore.calculateTotal(breakdown), 100);
        List<Suggestion> suggestionList = suggestions.generate(breakdown, skillsByCategory, matchScore, hasJobDesc);
        int wordCount = text.isBlank() ? 0 : text.split("\\s+").length;
        List<String> sections = atsScore.detectSections(text);

        return AnalysisResult.builder()
            .fileName(file.getOriginalFilename())
            .atsScore(total)
            .atsBreakdown(breakdown)
            .skillsByCategory(skillsByCategory)
            .allDetectedSkills(allSkills)
            .totalSkillsFound(allSkills.size())
            .suggestions(suggestionList)
            .wordCount(wordCount)
            .detectedSections(sections)
            .jobMatchScore(matchScore)
            .matchedKeywords(matched)
            .missingKeywords(missing)
            .hasJobDescription(hasJobDesc)
            .build();
    }
}
