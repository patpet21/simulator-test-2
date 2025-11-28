
import React, { useEffect, useState } from 'react';
import { StepProps, AiRiskReport } from '../types';
import { generateRiskReport } from '../services/mockAiService';
import { Button } from '../components/ui/Button';

export const SummaryStep: React.FC<StepProps> = ({ data, onValidationChange }) => {
  const [report, setReport] = useState<AiRiskReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onValidationChange(true);
    generateRiskReport(data).then(res => {
        setReport(res);
        setLoading(false);
    });
  }, [data, onValidationChange]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Generating Pre-Deployment Audit...</p>
      </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold font-display text-slate-900">Final Audit Report</h2>
         <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-500">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>

      {/* Scorecard */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
         <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" className="text-slate-700" fill="none" />
                 <circle cx="64" cy="64" r="60" stroke={report?.score! > 80 ? '#10b981' : '#f59e0b'} strokeWidth="8" 
                    strokeDasharray={377} strokeDashoffset={377 - (377 * (report?.score || 0)) / 100}
                    className="transition-all duration-1000 ease-out" fill="none" 
                 />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-display">{report?.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
               </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
               <div>
                 <h3 className="text-xl font-bold mb-1">Tokenization Readiness: <span className={report?.level === 'Low' ? 'text-green-400' : 'text-amber-400'}>{report?.level} Risk</span></h3>
                 <p className="text-slate-400 text-sm">Based on your jurisdiction ({data.jurisdiction.country}), compliance setup, and financial health.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg">
                     <span className="text-xs text-slate-400 uppercase block">Est. Market Cap</span>
                     <span className="font-mono font-bold">${((data.tokenomics.pricePerToken * data.tokenomics.totalSupply) || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                     <span className="text-xs text-slate-400 uppercase block">Reg Framework</span>
                     <span className="font-mono font-bold">{data.compliance.regFramework || 'N/A'}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Roadmap */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-brand-500"></span>
               Legal & Tech Roadmap
            </h3>
            <div className="space-y-4">
               {report?.legalRoadmap?.map((step, i) => (
                  <div key={i} className="flex gap-3">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                        {i !== (report?.legalRoadmap.length || 0) - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                     </div>
                     <p className="text-sm text-slate-600 py-1">{step}</p>
                  </div>
               ))}
               {(!report?.legalRoadmap || report.legalRoadmap.length === 0) && <p className="text-sm text-slate-400">Roadmap generation pending.</p>}
            </div>
         </div>

         {/* Warnings */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               Critical Attention Points
            </h3>
            <ul className="space-y-3">
               {report?.warnings?.map((warn, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50 p-2 rounded">
                     <span className="text-amber-500 font-bold">!</span> {warn}
                  </li>
               ))}
               {(!report?.warnings || report.warnings.length === 0) && <li className="text-slate-400 italic">No critical warnings found.</li>}
            </ul>
         </div>
      </div>
    </div>
  );
};
