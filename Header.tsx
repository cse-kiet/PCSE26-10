import { ShieldCheck, Cpu, Search, AlertCircle, History } from "lucide-react"

export default function Header() {
  return (
    <header className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3 bg-white rounded-[24px] p-5 border border-slate-200 flex items-center shadow-sm">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">VeriScan AI</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Institutional v4.2</p>
            </div>
          </div>
          <nav className="col-span-12 md:col-span-9 bg-white rounded-[24px] px-8 py-5 border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex space-x-8">
              <button className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 text-sm">New Scan</button>
              <button className="text-slate-400 font-bold hover:text-slate-800 transition-colors text-sm uppercase tracking-wider">Reports</button>
              <button className="text-slate-400 font-bold hover:text-slate-800 transition-colors text-sm uppercase tracking-wider">API Docs</button>
            </div>
            <div className="flex items-center space-x-4">
               <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900">Research Lab</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">System Optimal</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200">
                <History className="w-5 h-5" />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
