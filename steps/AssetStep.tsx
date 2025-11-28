
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { AiSuggestionBox } from '../components/AiSuggestionBox';
import { BusinessPlanGenerator } from '../components/BusinessPlanGenerator';
import { analyzeAssetFinancials, autoFillAssetGeneral, autoFillAssetFinancials } from '../services/mockAiService';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqwnfho9b/image/upload";
const CLOUDINARY_PRESET = "realestate-wizard";

export const AssetStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { asset, projectInfo } = data;
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'BUSINESS_PLAN'>('DETAILS');
  const [aiContent, setAiContent] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  useEffect(() => {
    // Validate
    const hasGeneral = Boolean(asset.assetName && asset.valuation > 0);
    // Simple check for financials
    let hasFinancials = true; 
    if (asset.category === 'Real Estate') hasFinancials = (asset.financials.noi ?? 0) >= 0;
    
    onValidationChange(hasGeneral && hasFinancials);
  }, [asset, onValidationChange]);

  const updateAsset = (field: string, val: any) => updateData('asset', { [field]: val });
  const updateFin = (field: string, val: any) => updateData('asset', { financials: { ...asset.financials, [field]: val }});

  const handleRunAnalysis = async () => {
    setIsAiLoading(true);
    const result = await analyzeAssetFinancials(asset);
    setAiContent(result);
    setIsAiLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
            const currentImages = asset.images || [];
            updateAsset('images', [...currentImages, data.secure_url]);
        }
    } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleAutoFillGeneral = async () => {
      setIsAutoFilling(true);
      const result = await autoFillAssetGeneral(projectInfo, asset.category);
      if (result) {
          if(result.assetName) updateAsset('assetName', result.assetName);
          if(result.valuation) updateAsset('valuation', result.valuation);
          if(result.assetType) updateAsset('assetType', result.assetType);
          if(result.industry) updateAsset('industry', result.industry);
          if(result.sqft) updateAsset('sqft', result.sqft);
          if(result.address) updateAsset('address', result.address);
          if(result.description) updateAsset('description', result.description);
      }
      setIsAutoFilling(false);
  };

  const handleAutoFillFinancials = async () => {
      setIsAutoFilling(true);
      const result = await autoFillAssetFinancials(projectInfo, asset.category, asset.valuation);
      if (result) {
          if(result.noi) updateFin('noi', result.noi);
          if(result.revenue) updateFin('revenue', result.revenue);
          if(result.ebitda) updateFin('ebitda', result.ebitda);
          if(result.occupancyRate) updateFin('occupancyRate', result.occupancyRate);
          if(result.existingDebt) updateFin('existingDebt', result.existingDebt);
      }
      setIsAutoFilling(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold font-display text-slate-900">2. Asset & Business Plan</h2>
           <p className="text-slate-600">Define the asset specs, financial health, and generate the offering strategy.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('DETAILS')}
             className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'DETAILS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Asset Details
           </button>
           <button 
             onClick={() => setActiveTab('BUSINESS_PLAN')}
             className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'BUSINESS_PLAN' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Business Plan
           </button>
        </div>
      </div>

      {/* --- TAB 1: ASSET DETAILS (General + Financials + Media) --- */}
      {activeTab === 'DETAILS' && (
        <div className="space-y-8 animate-slideUp">
           
           {/* Section A: General Info */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">General Information</h3>
                    <Button 
                        size="sm" 
                        onClick={handleAutoFillGeneral} 
                        disabled={isAutoFilling}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                    >
                        {isAutoFilling ? 'AI Extracting...' : '✨ Auto-Fill from Step 1'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        id="assetName" label="Asset Name / Title" 
                        value={asset.assetName} onChange={e => updateAsset('assetName', e.target.value)}
                        className="md:col-span-2"
                        placeholder="e.g. Skyline Luxury Apartments"
                    />
                    
                    <Input 
                        id="valuation" label="Appraised Valuation (USD)" type="number"
                        value={asset.valuation || ''} onChange={e => updateAsset('valuation', parseFloat(e.target.value))}
                    />
                    
                    {asset.category === 'Real Estate' && (
                        <>
                        <Select 
                            id="atype" label="Property Type"
                            options={[{value: 'Residential', label: 'Residential'}, {value: 'Commercial', label: 'Commercial'}]}
                            value={asset.assetType || ''} onChange={e => updateAsset('assetType', e.target.value)}
                        />
                        <Input id="sqft" label="Total Sq Ft" type="number" value={asset.sqft || ''} onChange={e => updateAsset('sqft', parseFloat(e.target.value))} />
                        <Input id="addr" label="Property Address" className="md:col-span-2" value={asset.address || ''} onChange={e => updateAsset('address', e.target.value)} />
                        </>
                    )}

                    {asset.category === 'Business' && (
                        <>
                        <Input id="ind" label="Industry" value={asset.industry || ''} onChange={e => updateAsset('industry', e.target.value)} />
                        <Input id="founded" label="Year Founded" type="number" value={asset.yearFounded || ''} onChange={e => updateAsset('yearFounded', parseInt(e.target.value))} />
                        </>
                    )}
                    
                    {asset.category === 'Art' && (
                        <>
                        <Input id="artist" label="Artist Name" value={asset.artistName || ''} onChange={e => updateAsset('artistName', e.target.value)} />
                        <Input id="medium" label="Medium" value={asset.medium || ''} onChange={e => updateAsset('medium', e.target.value)} />
                        </>
                    )}

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
                        <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                        placeholder="Briefly describe the investment highlights..."
                        value={asset.description || ''}
                        onChange={e => updateAsset('description', e.target.value)}
                        />
                    </div>
                </div>
           </div>

           {/* Section B: Financials */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-700">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Financial Performance</h3>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={handleAutoFillFinancials} 
                        disabled={isAutoFilling}
                        className="bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-sm"
                    >
                        {isAutoFilling ? 'Estimating...' : '✨ Estimate Financials via AI'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        id="debt" label="Existing Debt / Liens" type="number" 
                        value={asset.financials.existingDebt || ''} onChange={e => updateFin('existingDebt', parseFloat(e.target.value))}
                        placeholder="0"
                    />
                    
                    {asset.category === 'Real Estate' && (
                    <>
                        <Input 
                        id="noi" label="Annual Net Operating Income (NOI)" type="number" 
                        value={asset.financials.noi || ''} onChange={e => updateFin('noi', parseFloat(e.target.value))}
                        />
                        <Input 
                        id="occupancy" label="Occupancy Rate (%)" type="number" max="100"
                        value={asset.financials.occupancyRate || ''} onChange={e => updateFin('occupancyRate', parseFloat(e.target.value))}
                        />
                    </>
                    )}

                    {asset.category === 'Business' && (
                        <>
                        <Input 
                        id="rev" label="Annual Revenue" type="number" 
                        value={asset.financials.revenue || ''} onChange={e => updateFin('revenue', parseFloat(e.target.value))}
                        />
                        <Input 
                        id="ebitda" label="EBITDA" type="number" 
                        value={asset.financials.ebitda || ''} onChange={e => updateFin('ebitda', parseFloat(e.target.value))}
                        />
                        <Input 
                        id="burn" label="Monthly Burn Rate" type="number" 
                        value={asset.financials.burnRate || ''} onChange={e => updateFin('burnRate', parseFloat(e.target.value))}
                        />
                        </>
                    )}
                </div>
                
                <div className="mt-6 border-t border-slate-200 pt-6">
                    <AiSuggestionBox 
                        isLoading={isAiLoading}
                        onAsk={handleRunAnalysis}
                        content={aiContent}
                        title="Financial Health Check"
                        contextNote={`Click to analyze the financial viability of ${asset.assetName || 'this asset'} based on the KPIs entered.`}
                    />
                </div>
           </div>

           {/* Section C: Media */}
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Asset Imagery
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(asset.images || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
                            <img src={img} alt="Asset" className="w-full h-full object-cover" />
                            <button 
                            onClick={() => {
                                const newImages = asset.images.filter((_, i) => i !== idx);
                                updateAsset('images', newImages);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-all aspect-square text-slate-400 hover:text-brand-600">
                        {isUploading ? (
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span className="text-xs font-bold uppercase">Add Photo</span>
                            </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                </div>
           </div>
        </div>
      )}

      {/* --- TAB 2: BUSINESS PLAN --- */}
      {activeTab === 'BUSINESS_PLAN' && (
          <div className="animate-slideUp space-y-6">
              <BusinessPlanGenerator 
                asset={asset}
                projectInfo={projectInfo}
                onUpdate={(plan) => updateAsset('generatedBusinessPlan', plan)}
              />
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">External Documentation</h3>
                  <Input 
                    id="bpLink" 
                    label="Link to External Business Plan (PDF/Doc)" 
                    placeholder="https://docsend.com/view/..."
                    value={asset.businessPlanUrl || ''}
                    onChange={e => updateAsset('businessPlanUrl', e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                      If you already have a prepared prospectus or teaser deck, paste the secure link here.
                  </p>
              </div>
          </div>
      )}
    </div>
  );
};
