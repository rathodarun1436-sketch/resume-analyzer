package com.resumeanalyzer.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SkillExtractionService {

    private static final Map<String, List<String>> SKILL_CATEGORIES = new LinkedHashMap<>();

    static {
        SKILL_CATEGORIES.put("Programming Languages", List.of(
            "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Golang",
            "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB",
            "Perl", "Bash", "Shell", "PowerShell", "Groovy", "Dart", "Haskell", "Elixir"
        ));

        SKILL_CATEGORIES.put("Web & Frameworks", List.of(
            "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask",
            "FastAPI", "Spring Boot", "Spring", "Laravel", "Rails", "Next.js",
            "Nuxt.js", "Svelte", "ASP.NET", ".NET", "Hibernate", "GraphQL",
            "REST", "gRPC", "Bootstrap", "Tailwind", "jQuery", "Redux"
        ));

        SKILL_CATEGORIES.put("Databases", List.of(
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle",
            "SQL Server", "SQLite", "DynamoDB", "Elasticsearch", "Neo4j",
            "MariaDB", "Firebase", "Supabase", "Snowflake", "BigQuery", "HBase"
        ));

        SKILL_CATEGORIES.put("Cloud & DevOps", List.of(
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible",
            "Jenkins", "GitHub Actions", "CircleCI", "Helm", "Prometheus", "Grafana",
            "EKS", "ECS", "Lambda", "S3", "EC2", "RDS", "ArgoCD", "Linux", "Unix"
        ));

        SKILL_CATEGORIES.put("Tools & Practices", List.of(
            "Git", "GitHub", "GitLab", "Bitbucket", "Maven", "Gradle", "npm", "yarn",
            "Webpack", "Vite", "JIRA", "Confluence", "Postman", "Swagger", "SonarQube",
            "JUnit", "Jest", "Pytest", "Selenium", "Cypress", "Mockito",
            "TDD", "BDD", "CI/CD", "Agile", "Scrum", "Kanban", "Microservices"
        ));

        SKILL_CATEGORIES.put("Data & AI/ML", List.of(
            "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy",
            "Spark", "Hadoop", "Kafka", "Airflow", "Machine Learning", "Deep Learning",
            "NLP", "Computer Vision", "Data Science", "ETL", "Power BI", "Tableau"
        ));

        SKILL_CATEGORIES.put("Soft Skills", List.of(
            "Leadership", "Communication", "Teamwork", "Problem-solving",
            "Collaboration", "Analytical", "Adaptability", "Time Management",
            "Project Management", "Mentoring", "Coaching", "Critical Thinking"
        ));
    }

    public Map<String, List<String>> extractSkillsByCategory(String text) {
        String lower = text.toLowerCase();
        Map<String, List<String>> result = new LinkedHashMap<>();

        for (Map.Entry<String, List<String>> entry : SKILL_CATEGORIES.entrySet()) {
            List<String> found = entry.getValue().stream()
                .filter(skill -> matchesSkill(lower, skill))
                .collect(Collectors.toList());
            if (!found.isEmpty()) {
                result.put(entry.getKey(), found);
            }
        }
        return result;
    }

    private boolean matchesSkill(String text, String skill) {
        String lowerSkill = skill.toLowerCase();
        // Plain words: use word boundary; skills with special chars: substring match
        if (lowerSkill.matches("[a-z ]+")) {
            return Pattern.compile("\\b" + Pattern.quote(lowerSkill) + "\\b").matcher(text).find();
        }
        return text.contains(lowerSkill);
    }

    public static Map<String, List<String>> getSkillCategories() {
        return SKILL_CATEGORIES;
    }
}
