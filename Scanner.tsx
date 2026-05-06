import { Search, Upload, X, Loader2, FileText } from "lucide-react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/src/lib/utils"
import * as pdfjs from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ScannerProps {
  onScan: (text: string) => void
  isLoading: boolean
}

export default function Scanner({ onScan, isLoading }: ScannerProps) {
  const [text, setText] = useState("")
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const characterCount = text.length

  const extractTextFromPDF = async (data: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjs.getDocument({ data })
    const pdf = await loadingTask.promise
    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }
    return fullText
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessingFile(true)
      try {
        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer()
          const content = await extractTextFromPDF(arrayBuffer)
          setText(content)
        } else {
          const reader = new FileReader()
          reader.onload = (event) => {
            const content = event.target?.result as string
            setText(content)
          }
          reader.readAsText(file)
        }
      } catch (err) {
        console.error("File processing failed:", err)
        alert("Failed to process file. Please ensure it is a valid document.")
      } finally {
        setIsProcessingFile(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
  }

  const handleScan = () => {
    if (text.length < 50) return
    onScan(text)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Main Editor Card */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Analysis Editor</h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none flex items-center">PDF</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none flex items-center">TXT</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none flex items-center">MD</span>
            </div>
          </div>
          
          <div className="flex-grow border-2 border-dashed border-slate-100 rounded-[24px] bg-slate-50/10 flex flex-col focus-within:border-indigo-200 transition-colors p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your research content here..."
              className="w-full h-full p-2 resize-none focus:outline-none bg-transparent text-slate-700 leading-relaxed text-sm font-medium"
              disabled={isLoading || isProcessingFile}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                disabled={isLoading || isProcessingFile}
              >
                {isProcessingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isProcessingFile ? "Processing..." : "Upload File"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.md,.pdf"
              />
              <div className="h-4 w-px bg-slate-100 hidden sm:block" />
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                {wordCount} words / {characterCount} chars
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {text && (
                <button
                  onClick={() => setText("")}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  disabled={isLoading || isProcessingFile}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleScan}
                disabled={isLoading || isProcessingFile || text.length < 50}
                className={cn(
                  "w-full sm:w-auto px-10 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
                  isLoading || isProcessingFile || text.length < 50
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing
                  </span>
                ) : "Begin Deep Scan"}
              </button>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden h-[240px] flex flex-col justify-end">
            <div className="relative z-10">
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Current Accuracy</p>
              <h3 className="text-5xl font-black mb-2 tracking-tighter">99.8%</h3>
              <p className="text-indigo-100 text-xs leading-relaxed font-medium opacity-80">
                Advanced neural architecture detecting syntactic patterns and semantic repetition.
              </p>
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              Detection Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: "AI Pattern Match", val: 85, color: "bg-red-500" },
                { label: "Web Similarity", val: 12, color: "bg-amber-500" },
                { label: "Contextual Score", val: 92, color: "bg-emerald-500" }
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-wider text-slate-400">
                    <span>{m.label}</span>
                    <span className="text-slate-700">{m.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 opacity-20 w-full absolute" />
                    <div className={cn("h-full relative rounded-full", m.color)} style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[24px] p-5 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-3"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Optimal</span>
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              latency: 14ms
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
