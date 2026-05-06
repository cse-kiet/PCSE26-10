/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import Scanner from "./components/Scanner"
import Report from "./components/Report"
import { analyzeText, AnalysisResult } from "./services/gemini"
import { ShieldCheck, Info, Sparkles } from "lucide-react"

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (text: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await analyzeText(text)
      setResult(data)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6 max-w-3xl mx-auto py-12">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  Institutional v4.2
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Content Integrity <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Reimagined.</span>
                </h1>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
                  Professional grade detection system for academic and creative integrity. Deep neural cross-referencing in milliseconds.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-7xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 mb-4 shadow-sm">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold">{error}</p>
                  <button onClick={() => setError(null)} className="ml-auto text-[10px] font-black uppercase hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors ring-1 ring-red-200">Dismiss</button>
                </div>
              )}

              <Scanner onScan={handleScan} isLoading={isLoading} />
            </motion.div>
          ) : (
            <Report result={result} onReset={handleReset} />
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
            <div className="flex items-center gap-3 grayscale opacity-30">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-sm font-black tracking-widest uppercase">VeriScan AI</span>
            </div>
            <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Legal</a>
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">
              © {new Date().getFullYear()} Institutional Edition
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
