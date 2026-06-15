package com.resumeanalyzer.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Suggestion {
    private String category;
    private String priority; // HIGH | MEDIUM | LOW
    private String title;
    private String description;
    private List<String> examples;
}
