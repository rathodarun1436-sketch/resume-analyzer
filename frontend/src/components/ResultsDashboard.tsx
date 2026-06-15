import { AnalysisResult, Suggestion } from '../types'
import {
  ArrowLeft, FileText, Award, Layers, Target, Lightbulb,
  CheckCircle2, XCircle, AlertCircle, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react'
import { useState } from 'react'

interface Props {
  result: AnalysisResult
  onBack: () => void
}

/* ── Circular Score Ring ─────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const size = 180, sw = 14, r = (size - sw) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const glow  = score >= 75 ? '0 0 28px #10b98170' : score >= 50 ? '0 0 28px #f59e0b70' : '0 0 28px #f43f5e70'
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work'

  return (
    <div className="flex flex-col items-center gap-2 animate-score-pop">
      <svg width={size} height={size} style={{ overflow: 'visible', filter: glow }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c0e02" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)',
                   filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 3px ${color})` }} />
        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="38" fontWeight="800">{score}</text>
        <text x="50%" y="63%" textAnchor="middle" dominantBaseline="middle"
          fill="#94a3b8" fontSize="13">{label}</text>
      </svg>
      <p className="text-slate-400 text-sm">ATS Score</p>
    </div>
  )
}

/* ── Breakdown Bar ───────────────────────────────────────────── */
function BreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = (value / max) * 100
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>{label}</span>
        <span className="font-semibold text-slate-200">{value}<span className="text-slate-600">/{max}</span></span>
      </div>
      <div className="h-2 bg-[#1c0e02] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color,
                   boxShadow: pct > 0 ? `0 0 8px ${color}60` : 'none' }} />
      </div>
    </div>
  )
}

/* ── Skill Tag ───────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  'Programming Languages': 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  'Web & Frameworks':      'bg-orange-500/20 text-orange-300 border-orange-400/40',
  'Databases':             'bg-rose-500/20 text-rose-300 border-rose-400/40',
  'Cloud & DevOps':        'bg-pink-500/20 text-pink-300 border-pink-400/40',
  'Tools & Practices':     'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
  'Data & AI/ML':          'bg-red-500/20 text-red-300 border-red-400/40',
  'Soft Skills':           'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
}

function SkillTag({ skill, category }: { skill: string; category: string }) {
  const color = CATEGORY_COLORS[category] ?? 'bg-slate-700/40 text-slate-300 border-slate-500/40'
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-transform
      hover:scale-105 cursor-default ${color}`}>
      {skill}
    </span>
  )
}

/* ── Suggestion Card ─────────────────────────────────────────── */
function SuggestionCard({ s }: { s: Suggestion }) {
  const [open, setOpen] = useState(false)
  const cfg = {
    HIGH:   { bg: 'bg-rose-500/10 border-rose-500/30',   badge: 'bg-rose-500/25 text-rose-300',   dot: 'bg-rose-400'   },
    MEDIUM: { bg: 'bg-amber-500/10 border-amber-500/30', badge: 'bg-amber-500/25 text-amber-300', dot: 'bg-amber-400'  },
    LOW:    { bg: 'bg-emerald-500/10 border-emerald-500/30', badge: 'bg-emerald-500/25 text-emerald-300', dot: 'bg-emerald-400' },
  }[s.priority]

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-200 hover:shadow-lg ${cfg.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>{s.priority}</span>
              <span className="text-xs text-slate-500">{s.category}</span>
            </div>
            <p className="font-semibold text-white text-sm">{s.title}</p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{s.description}</p>
          </div>
        </div>
        {s.examples.length > 0 && (
          <button onClick={() => setOpen(v => !v)}
            className="text-slate-500 hover:text-amber-400 flex-shrink-0 mt-1 transition-colors">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      {open && s.examples.length > 0 && (
        <div className="mt-3 ml-5 flex flex-wrap gap-1.5">
          {s.examples.map(ex => (
            <span key={ex} className="text-xs px-2 py-1 rounded-lg bg-[#110a02]/80 text-slate-300 border border-amber-900/40">
              {ex}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Section Chip ────────────────────────────────────────────── */
function SectionChip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
      bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium
      transition-transform hover:scale-105">
      <CheckCircle2 size={11} />
      {label}
    </div>
  )
}

/* ── Section heading ─────────────────────────────────────────── */
function SectionHead({ icon: Icon, label, iconClass }: { icon: React.ElementType; label: string; iconClass: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={16} className={iconClass} />
      <span className="text-sm font-semibold text-slate-200">{label}</span>
    </div>
  )
}

/* ── Card wrapper ────────────────────────────────────────────── */
function Card({ children, delay = '0s', className = '' }: { children: React.ReactNode; delay?: string; className?: string }) {
  return (
    <div className={`glass-vivid rounded-3xl p-6 animate-fade-in-up card-lift relative overflow-hidden ${className}`}
      style={{ animationDelay: delay }}>
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),rgba(244,63,94,0.45),transparent)' }} />
      {children}
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────────── */
export default function ResultsDashboard({ result, onBack }: Props) {
  const { atsBreakdown: b } = result

  const breakdownItems = [
    { label: 'Contact Info',            value: b.contactInfo,           max: 10, color: '#f59e0b' },
    { label: 'Professional Summary',    value: b.summary,               max: 5,  color: '#fbbf24' },
    { label: 'Work Experience',         value: b.workExperience,        max: 10, color: '#f97316' },
    { label: 'Education',               value: b.education,             max: 10, color: '#fb923c' },
    { label: 'Skills Section',          value: b.skills,                max: 10, color: '#f43f5e' },
    { label: 'Action Verbs',            value: b.actionVerbs,           max: 15, color: '#10b981' },
    { label: 'Measurable Achievements', value: b.measurableAchievements,max: 10, color: '#e879f9' },
    { label: 'Word Count',              value: b.wordCount,             max: 10, color: '#a78bfa' },
    ...(result.hasJobDescription
      ? [{ label: 'Job Match Bonus', value: b.jobMatch, max: 20, color: '#38bdf8' }]
      : []),
  ]

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto bg-dots">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <button onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-amber-300 transition-colors text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Analyze another
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sm text-slate-300
          border border-amber-500/25">
          <FileText size={14} className="text-amber-400" />
          {result.fileName}
          <span className="text-slate-700">·</span>
          <span className="text-slate-500">{result.wordCount} words</span>
        </div>
      </div>

      {/* ── Top grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Score card */}
        <Card delay="0.05s" className="flex flex-col items-center gap-4">
          <SectionHead icon={Award} label="ATS Score" iconClass="text-amber-400" />
          <ScoreRing score={result.atsScore} />
          <div className="w-full grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-xl font-bold gradient-text">{result.totalSkillsFound}</p>
              <p className="text-xs text-slate-500">Skills Found</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
              <p className="text-xl font-bold gradient-text-rose">{result.detectedSections.length}</p>
              <p className="text-xs text-slate-500">Sections</p>
            </div>
          </div>
        </Card>

        {/* Breakdown */}
        <Card delay="0.1s">
          <SectionHead icon={TrendingUp} label="Score Breakdown" iconClass="text-orange-400" />
          <div className="flex flex-col gap-3.5">
            {breakdownItems.map(item => <BreakdownBar key={item.label} {...item} />)}
          </div>
        </Card>

        {/* Sections + Job Match */}
        <div className="flex flex-col gap-6">
          <Card delay="0.15s" className="flex-1">
            <SectionHead icon={Layers} label="Detected Sections" iconClass="text-rose-400" />
            <div className="flex flex-wrap gap-2">
              {result.detectedSections.map(s => <SectionChip key={s} label={s} />)}
              {result.detectedSections.length === 0 && (
                <p className="text-slate-500 text-sm">No standard sections detected</p>
              )}
            </div>
          </Card>

          {result.hasJobDescription && (
            <Card delay="0.18s">
              <SectionHead icon={Target} label="Job Match" iconClass="text-yellow-400" />
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-extrabold"
                  style={{ color: result.jobMatchScore >= 60 ? '#10b981'
                                 : result.jobMatchScore >= 35 ? '#f59e0b' : '#f43f5e' }}>
                  {result.jobMatchScore}%
                </span>
                <span className="text-slate-500 text-sm pb-1">keyword overlap</span>
              </div>
              <div className="h-2 bg-[#1c0e02] rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.jobMatchScore}%`,
                    background: result.jobMatchScore >= 60 ? '#10b981'
                               : result.jobMatchScore >= 35 ? '#f59e0b' : '#f43f5e'
                  }} />
              </div>
              {result.missingKeywords.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <XCircle size={11} className="text-rose-400" /> Missing keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.slice(0, 8).map(k => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded
                        bg-rose-500/10 text-rose-300 border border-rose-500/25">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* ── Skills panel ── */}
      <Card delay="0.2s" className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Detected Skills</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/15
            border border-emerald-500/30 text-emerald-300">{result.totalSkillsFound} found</span>
        </div>
        {Object.keys(result.skillsByCategory).length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle size={32} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No skills detected. Try adding a dedicated Skills section to your resume.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {Object.entries(result.skillsByCategory).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2.5">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => <SkillTag key={s} skill={s} category={cat} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Suggestions ── */}
      <Card delay="0.25s">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb size={16} className="text-amber-400" />
          <span className="text-sm font-semibold text-slate-200">Improvement Suggestions</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/15
            border border-amber-500/30 text-amber-300">{result.suggestions.length} tips</span>
        </div>
        {result.suggestions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-300 font-semibold">Great resume!</p>
            <p className="text-slate-500 text-sm mt-1">No major improvements detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.suggestions.map((s, i) => <SuggestionCard key={i} s={s} />)}
          </div>
        )}
      </Card>
    </div>
  )
}
