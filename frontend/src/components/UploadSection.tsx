import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, FileText, Briefcase, Zap, ShieldCheck, Target } from 'lucide-react'

interface Props {
  onAnalyze: (file: File, jobDescription: string) => void
  isLoading: boolean
}

export default function UploadSection({ onAnalyze, isLoading }: Props) {
  const [file, setFile]         = useState<File | null>(null)
  const [jobDesc, setJobDesc]   = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && isValidFile(dropped)) setFile(dropped)
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0]
    if (chosen && isValidFile(chosen)) setFile(chosen)
  }
  const isValidFile = (f: File) =>
    f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.doc')
  const handleSubmit = () => { if (file) onAnalyze(file, jobDesc) }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-dots">

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* amber — top-left */}
        <div className="absolute -top-48 -left-48 w-[520px] h-[520px] rounded-full opacity-30 blur-[100px] animate-orb"
          style={{ background: 'radial-gradient(circle, #d97706, #92400e, transparent)' }} />
        {/* rose — bottom-right */}
        <div className="absolute -bottom-48 -right-48 w-[480px] h-[480px] rounded-full opacity-25 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #f43f5e, #9f1239, transparent)',
                   animation: 'orb-drift 22s ease-in-out infinite reverse' }} />
        {/* orange — center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-7 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #fb923c, transparent)' }} />
        {/* yellow — top-right */}
        <div className="absolute top-16 right-24 w-72 h-72 rounded-full opacity-14 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)',
                   animation: 'orb-drift 26s ease-in-out infinite' }} />
      </div>

      {/* ── Header ── */}
      <div className="text-center mb-12 animate-fade-in-up relative z-10">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          <span className="gradient-text">AI Resume</span>
          <br />
          <span className="text-white">Analyzer</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Upload your resume and get an instant ATS score, skill analysis,
          and actionable improvement suggestions — completely free.
        </p>
      </div>

      {/* ── Feature pills ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up relative z-10"
        style={{ animationDelay: '0.1s' }}>
        {[
          { icon: ShieldCheck, label: 'ATS Score',        color: 'text-amber-400',  border: 'border-amber-500/30'  },
          { icon: Target,      label: 'Skill Extraction', color: 'text-orange-400', border: 'border-orange-500/30' },
          { icon: Briefcase,   label: 'Job Matching',     color: 'text-rose-400',   border: 'border-rose-500/30'   },
          { icon: Zap,         label: 'Instant Results',  color: 'text-yellow-400', border: 'border-yellow-500/30' },
        ].map(({ icon: Icon, label, color, border }) => (
          <div key={label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-slate-300 border ${border}
              transition-transform hover:scale-105 hover:text-white cursor-default`}>
            <Icon size={13} className={color} />
            {label}
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="w-full max-w-2xl glass-vivid rounded-3xl p-8 relative z-10 animate-fade-in-up card-lift"
        style={{ animationDelay: '0.2s' }}>

        {/* gradient top accent */}
        <div className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.7), rgba(244,63,94,0.5), transparent)' }} />

        {/* ── Drop zone ── */}
        <div
          onClick={() => !isLoading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300
            ${dragging
              ? 'border-amber-400 bg-amber-500/12 scale-[1.01]'
              : file
                ? 'border-emerald-500/60 bg-emerald-500/6'
                : 'border-amber-500/35 bg-amber-500/5 hover:border-amber-400/70 hover:bg-amber-500/10'
            }
          `}
        >
          <input ref={inputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileChange} />

          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center
                ring-1 ring-emerald-500/30">
                <FileText size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-emerald-300">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center animate-float
                ring-1 ring-amber-500/30">
                <Upload size={28} className="text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Drop your resume here</p>
                <p className="text-slate-400 text-sm mt-1">or click to browse · PDF, DOCX supported</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Job description ── */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Job Description <span className="text-amber-400">(optional — boosts match score)</span>
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description to see how well your resume matches..."
            rows={4}
            disabled={isLoading}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600
              bg-[#110a02]/70 border border-amber-900/50 focus:border-amber-500 focus:outline-none
              focus:ring-1 focus:ring-amber-500/40 resize-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="mt-6 w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-200
            disabled:opacity-35 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:shadow-none
            enabled:shimmer-btn enabled:hover:scale-[1.02] enabled:active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Resume...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap size={18} />
              Analyze My Resume
            </span>
          )}
        </button>
      </div>

      <p className="text-slate-700 text-xs mt-6 z-10 relative">
        Your resume is processed locally — never stored or shared.
      </p>
    </div>
  )
}
