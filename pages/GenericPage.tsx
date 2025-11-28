
import React from 'react';
import { Button } from '../components/ui/Button';

interface GenericPageProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onCta: () => void;
}

export const GenericPage: React.FC<GenericPageProps> = ({ title, subtitle, onBack, onCta }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col animate-fadeIn">
      {/* Navbar Placeholder (Consistent with Home) */}
      <nav className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
           <span className="font-bold font-display text-slate-900 text-lg">PropertyDEX</span>
        </div>
        <div className="flex gap-4">
             <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-900">Back Home</button>
             <Button onClick={onCta} className="text-xs px-4 py-2">Start Simulation</Button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12">
        <div className="bg-white rounded-3xl p-8 md:p-16 border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-6 tracking-tight">{title}</h1>
           <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
             {subtitle}
           </p>

           {/* Dummy Content Blocks */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 mb-4"></div>
                   <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                   <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                   <p className="mt-4 text-sm text-slate-400">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                   </p>
                </div>
              ))}
           </div>
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2024 PropertyDEX Simulator. All rights reserved.</p>
      </footer>
    </div>
  );
};
