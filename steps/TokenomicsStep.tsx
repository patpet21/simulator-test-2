
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { AllocationChart } from '../components/tokenomics/AllocationChart';
import { VestingVisualizer } from '../components/tokenomics/VestingVisualizer';
import { TokenStrategyPanel } from '../components/tokenomics/TokenStrategyPanel';
import { generateTokenomicsModel } from '../services/mockAiService';

export const TokenomicsStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { tokenomics, asset, projectInfo, jurisdiction } = data;
  const [activeTab, setActiveTab] = useState<'ARCHITECT' | 'STRATEGY'>('ARCHITECT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  useEffect(() => {
    onValidationChange(Boolean(tokenomics.tokenSymbol && tokenomics.totalSupply > 0 && tokenomics.pricePerToken > 0));
  }, [tokenomics, onValidationChange]);

  const handleChange = (field: string, val: any) => updateData('tokenomics', { [field]: val });
  
  const updateAlloc = (key: string, val: number) => {
    updateData('tokenomics', { allocation: { ...tokenomics.allocation, [key]: val }});
  };

  const handleAiDesign = async () => {
    setIsGenerating(true);
    const model = await generateTokenomicsModel(asset, projectInfo, jurisdiction);
    if (model) {
        // Bulk update
        updateData('tokenomics', {
            tokenName: model.tokenName || tokenomics.tokenName,
            tokenSymbol: model.tokenSymbol || tokenomics.tokenSymbol,
            totalSupply: model.totalSupply || tokenomics.totalSupply,
            pricePerToken: model.pricePerToken || tokenomics.pricePerToken,
            allocation: model.allocation || tokenomics.allocation,
            vestingSchedule: model.vestingSchedule || tokenomics.vestingSchedule
        });
        setAiTip(model.educationalNote || null);
    }
    setIsGenerating(false);
  };

  const totalRaise = (tokenomics.totalSupply || 0) * (tokenomics.pricePerToken || 0);
  const allocSum = Object.values(tokenomics.allocation || {founders:0, investors:0, treasury:0, advisors:0}).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-display text-slate-900">4. Token Architect</h2>
            <p className="text-slate-600">Design the economy and learn the strategy behind your digital asset.</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('ARCHITECT')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ARCHITECT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Token Calculator
            </button>
            <button 
                onClick={() => setActiveTab('STRATEGY')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'STRATEGY' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <span>Education & Strategy</span>
                <span className="bg-brand-100 text-brand-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">AI</span>
            </button>
        </div>
      </div>

      {activeTab === 'ARCHITECT' ? (
        <div className="animate-slideUp space-y-8">
            {/* AI Auto Design Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Need help with the math?</h4>
                        <p className="text-slate-500 text-xs">Let our AI calculate the optimal supply and price based on your ${asset.valuation?.toLocaleString()} valuation.</p>
                    </div>
                </div>
                <Button 
                    onClick={handleAiDesign} 
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 whitespace-nowrap"
                >
                    {isGenerating ? 'Calculating...' : '✨ Auto-Design Model'}
                </Button>
            </div>

            {aiTip && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 animate-fadeIn">
                    <div className="text-indigo-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-indigo-800 text-sm leading-relaxed">{aiTip}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Col: Configuration (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Core Metrics Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            Core Metrics
                            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Base Layer</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                id="name" label="Token Name" 
                                value={tokenomics.tokenName} onChange={e => handleChange('tokenName', e.target.value)} 
                                placeholder="e.g. Empire State Digitized"
                            />
                            <Input 
                                id="sym" label="Token Symbol" placeholder="$PROP"
                                value={tokenomics.tokenSymbol} onChange={e => handleChange('tokenSymbol', e.target.value)} 
                                className="font-mono uppercase"
                            />
                            <Input 
                                id="supply" label="Total Supply" type="number" 
                                value={tokenomics.totalSupply || ''} onChange={e => handleChange('totalSupply', parseFloat(e.target.value))} 
                            />
                            <Input 
                                id="price" label="Issue Price ($)" type="number" 
                                value={tokenomics.pricePerToken || ''} onChange={e => handleChange('pricePerToken', parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    {/* Allocation Sliders */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">Cap Table Allocation</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${allocSum === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {allocSum}% Allocated
                        </span>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { key: 'investors', label: 'Public Sale / Investors', color: 'bg-brand-500', desc: "Tokens sold during the STO." },
                            { key: 'founders', label: 'Team & Founders', color: 'bg-indigo-500', desc: "Retained by the original owners." },
                            { key: 'treasury', label: 'Reserve / Treasury', color: 'bg-slate-400', desc: "Held for future liquidity or maintenance." },
                            { key: 'advisors', label: 'Partners & Advisors', color: 'bg-amber-500', desc: "Legal, marketing, and strategic partners." },
                        ].map(item => (
                            <div key={item.key}>
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                                    {item.label}
                                </span>
                                <span>{(tokenomics.allocation as any)?.[item.key] || 0}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={(tokenomics.allocation as any)?.[item.key] || 0}
                                onChange={e => updateAlloc(item.key, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 hover:accent-brand-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    </div>

                    {/* Governance & Dividend Policy */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Governance & Yield</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Select 
                                id="vesting" label="Vesting Schedule"
                                options={[
                                    {value: 'None', label: 'No Vesting (Fully Liquid)'},
                                    {value: '6m linear', label: '6 Month Linear Release'},
                                    {value: '1y cliff', label: '1 Year Cliff, 4y Linear'},
                                    {value: '2y cliff', label: '2 Year Cliff (Long Term)'},
                                ]}
                                value={tokenomics.vestingSchedule || 'None'}
                                onChange={e => handleChange('vestingSchedule', e.target.value)}
                            />
                            <Select 
                                id="divs" label="Distribution Policy"
                                options={[
                                    {value: 'None', label: 'Capital Appreciation Only'},
                                    {value: 'Monthly', label: 'Monthly Rent Distribution'},
                                    {value: 'Quarterly', label: 'Quarterly Dividends'},
                                ]}
                                value={tokenomics.dividendPolicy || 'None'}
                                onChange={e => handleChange('dividendPolicy', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Col: Visualizations (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Terminal Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group border border-slate-800">
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none opacity-20 bg-[length:100%_4px]"></div>
                    
                    <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Market Cap</h3>
                            <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                                ${totalRaise.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FDV</h3>
                            <div className="text-sm font-mono text-slate-300 mt-1">
                                ${totalRaise.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Asset Valuation</span>
                            <span className="text-slate-300">${asset.valuation?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Collateral Ratio</span>
                            <span className={`${totalRaise > asset.valuation ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {asset.valuation > 0 ? ((asset.valuation / totalRaise) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                    </div>

                    {/* Donut Chart Component */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-left">Allocation Breakdown</h3>
                        <AllocationChart allocation={tokenomics.allocation} />
                    </div>

                    {/* Vesting Visualization Component */}
                    <VestingVisualizer schedule={tokenomics.vestingSchedule || 'None'} />

                </div>
            </div>
        </div>
      ) : (
        <div className="animate-slideUp">
            <TokenStrategyPanel 
                asset={asset}
                project={projectInfo}
                jurisdiction={jurisdiction}
            />
        </div>
      )}
    </div>
  );
};
