# AI Resume Analyzer

Resume analyzer with ATS scoring, skill extraction, keyword matching, and improvement suggestions.
**No paid AI APIs** — uses Apache Tika for text extraction and rule-based NLP.

## Tech Stack
| Layer    | Technology |
|----------|-----------|
| Backend  | Spring Boot 3.4, Java 21, Apache Tika 2.9 |
| Frontend | React 18, TypeScript, Tailwind CSS v4, Vite |

## Features
- **Resume Upload** — PDF & DOCX via Apache Tika
- **Skill Extraction** — 130+ skills across 7 categories
- **ATS Score** — 9-factor weighted scoring (0–100)
- **Job Description Matching** — keyword overlap %
- **Improvement Suggestions** — prioritised HIGH/MEDIUM/LOW tips

## Running Locally

### Backend
```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# UI at http://localhost:5173
```

## API
```
POST /api/resume/analyze
  Content-Type: multipart/form-data
  file          (required) — .pdf / .docx
  jobDescription (optional) — plain text

GET /api/resume/skills-catalog
```
