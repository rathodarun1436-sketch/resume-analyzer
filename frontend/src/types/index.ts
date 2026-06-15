export interface AtsBreakdown {
  contactInfo: number;
  summary: number;
  workExperience: number;
  education: number;
  skills: number;
  actionVerbs: number;
  measurableAchievements: number;
  wordCount: number;
  jobMatch: number;
}

export interface Suggestion {
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  examples: string[];
}

export interface AnalysisResult {
  fileName: string;
  atsScore: number;
  atsBreakdown: AtsBreakdown;
  skillsByCategory: Record<string, string[]>;
  allDetectedSkills: string[];
  totalSkillsFound: number;
  suggestions: Suggestion[];
  wordCount: number;
  detectedSections: string[];
  jobMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  hasJobDescription: boolean;
}
