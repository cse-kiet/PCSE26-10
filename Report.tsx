import { AnalysisResult, RiskLevel } from "@/src/services/gemini"
import { motion } from "framer-motion"
import { ShieldAlert, Cpu, Search, AlertCircle, CheckCircle2, ChevronRight, FileText } from "lucide-react"
import { cn } from "@/src/lib/utils"
import confetti from "canvas-confetti"
import { useEffect } from "react"
import Markdown from "react-markdown"

interface ReportProps {
  result: AnalysisResult | null
  onReset: () => void
}

export default function Report({ result, onReset }: ReportProps) {
  useEffect(() => {
    if (result && result.overallScore < 20) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4f46e5", "#10b981"]
      })
    }
  }, [result])

  if (!result) return null

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return "text-red-600 bg-red-50 border-red-100"
      case RiskLevel.MEDIUM: return "text-orange-600 bg-orange-50 border-orange-100"
      case RiskLevel.LOW: return "text-green-600 bg-green-50 border-green-100"
      default: return "text-gray-600 bg-gray-50 border-gray-100"
    }
  }

  const getOverallStatus = (score: number) => {
    if (score > 60) return { label: "High Risk", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" }
    if (score > 30) return { label: "Moderate Concern", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" }
    return { label: "Verified Content", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" }
  }

  const status = getOverallStatus(result.overallScore)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-20"
    >
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Institutional Analysis Report</h2>
        <button 
          onClick={onReset}
          className="bg-white border border-slate-200 px-5 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          New Deep Scan <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Status Bento Card */}
        <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-50"
              />
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={502.6}
                strokeDashoffset={502.6 - (502.6 * result.overallScore) / 100}
                strokeLinecap="round"
                className={cn("transition-all duration-1000", status.color)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-5xl font-black tracking-tighter", status.color)}>{result.overallScore}%</span>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Suspicion</span>
            </div>
          </div>
          <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest", status.bg, status.color)}>
            <status.icon className="w-4 h-4" />
            {status.label}
          </div>
        </div>

        {/* Detailed Metrics Card Group */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-slate-900 text-xs uppercase tracking-widest">AI Content Pattern</span>
                <p className="text-[10px] text-slate-400 font-bold">Neural Signature Analysis</p>
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{result.aiProbability}%</div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
               <div 
                className="bg-indigo-600 h-full transition-all duration-1000 rounded-full" 
                style={{ width: `${result.aiProbability}%` }} 
               />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-slate-900 text-xs uppercase tracking-widest">Similarity Database</span>
                <p className="text-[10px] text-slate-400 font-bold">Cross-Reference Match</p>
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{result.plagiarismProbability}%</div>
             <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
               <div 
                className="bg-rose-600 h-full transition-all duration-1000 rounded-full" 
                style={{ width: `${result.plagiarismProbability}%` }} 
               />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Summary</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-300 font-medium prose prose-invert prose-sm max-w-none">
              <Markdown>{result.summary}</Markdown>
            </div>
          </div>
        </div>

        {/* Segments Column */}
        <div className="col-span-12 space-y-4 pt-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Segment Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.segments.length > 0 ? (
              result.segments.map((segment, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-6 rounded-[28px] border transition-all hover:shadow-lg flex flex-col h-full",
                    getRiskColor(segment.likelihood)
                  )}
                >
                  <p className="text-sm leading-relaxed font-bold italic mb-6">"{segment.text}"</p>
                  <div className="mt-auto space-y-3">
                    <div className="h-px bg-current opacity-10 w-full" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{segment.reason}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-white/40 ring-1 ring-black/5">{segment.likelihood}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-emerald-50 text-emerald-700 p-12 rounded-[32px] border border-emerald-100 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-bold text-lg tracking-tight">Integrity Verified</p>
                <p className="text-sm opacity-70">No highly suspicious segments detected in this analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-12">
        <button 
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center gap-3 shadow-2xl shadow-slate-200"
          onClick={() => window.print()}
        >
          Generate PDF Report
        </button>
      </div>
    </motion.div>
  )
}
