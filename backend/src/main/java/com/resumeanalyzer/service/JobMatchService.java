package com.resumeanalyzer.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobMatchService {

    private static final Set<String> STOP_WORDS = Set.of(
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
        "have", "has", "had", "do", "does", "did", "will", "would", "can",
        "could", "should", "may", "might", "not", "this", "that", "these",
        "those", "we", "you", "it", "he", "she", "they", "our", "your", "its",
        "as", "if", "than", "then", "so", "each", "all", "more", "most",
        "some", "no", "also", "into", "about", "over", "after", "such", "up"
    );

    public int calculateMatchScore(String resumeText, String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) return 0;
        Set<String> resumeWords = keywords(resumeText);
        Set<String> jobWords = keywords(jobDescription);
        if (jobWords.isEmpty()) return 0;
        long matches = jobWords.stream().filter(resumeWords::contains).count();
        return (int) Math.round((double) matches / jobWords.size() * 100);
    }

    public List<String> getMatchedKeywords(String resumeText, String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) return List.of();
        Set<String> resumeWords = keywords(resumeText);
        return keywords(jobDescription).stream()
            .filter(resumeWords::contains)
            .sorted()
            .collect(Collectors.toList());
    }

    public List<String> getMissingKeywords(String resumeText, String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) return List.of();
        Set<String> resumeWords = keywords(resumeText);
        return keywords(jobDescription).stream()
            .filter(w -> !resumeWords.contains(w))
            .filter(w -> w.length() > 3)
            .sorted()
            .limit(20)
            .collect(Collectors.toList());
    }

    private Set<String> keywords(String text) {
        return Arrays.stream(text.toLowerCase().split("[^a-zA-Z0-9+#.]+"))
            .filter(w -> w.length() > 2)
            .filter(w -> !STOP_WORDS.contains(w))
            .collect(Collectors.toSet());
    }
}
