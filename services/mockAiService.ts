
import { GoogleGenAI, Type } from "@google/genai";
import { JurisdictionData, AssetData, TokenizationCategory, AiRiskReport, EntityDetails, ProjectInfo, TokenizationState, TokenomicsData, QuizData } from '../types';
import { 
  GET_REGION_RECOMMENDATIONS_PROMPT, 
  ANALYZE_JURISDICTION_PROMPT,
  RECOMMEND_SPV_PROMPT,
  GENERATE_ENTITY_DETAILS_PROMPT
} from '../prompts/jurisdictionPrompts';
import { ANALYZE_FINANCIALS_PROMPT } from '../prompts/financialPrompts';
import { GENERATE_BUSINESS_PLAN_PROMPT } from '../prompts/businessPlanPrompt';
import { GENERATE_RISK_REPORT_PROMPT } from '../prompts/riskPrompts';
import { AUTOFILL_ASSET_GENERAL_PROMPT, AUTOFILL_ASSET_FINANCIALS_PROMPT } from '../prompts/assetPrompts';
import { GENERATE_TOKENOMICS_PROMPT } from '../prompts/tokenomicsPrompts';
import { GENERATE_TOKEN_STRATEGY_PROMPT } from '../prompts/strategyPrompts';
import { GENERATE_QUIZ_PROMPT } from '../prompts/educationPrompts';
import { CHECK_TOKENIZABILITY_PROMPT } from '../prompts/tokenizabilityPrompts';
import { MATCHMAKER_PROMPT, MatchmakerPreferences } from '../prompts/matchmakerPrompts';
import { EXPLAIN_SPV_PROMPT, JURISDICTION_SUMMARY_PROMPT, GENERAL_REQUIREMENTS_PROMPT } from '../prompts/legalEducationPrompts';
import { GENERATE_CASE_STUDY_PROMPT } from '../prompts/caseStudyPrompts';
import { IMPROVE_DESCRIPTION_PROMPT } from '../prompts/projectPrompts';

// Initialize Gemini with safe environment variable access for Vite
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || "AIzaSyDjJo7yKpRccHQVeWnuliRl6V1ysu1jL6A";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export interface AiResponse {
  text?: string;
  risks?: string[];
  recommendations?: string[];
  // New Educational Fields
  restrictions?: string;
  minDocs?: string[];
  geoBlocking?: string;
  riskNote?: string;
}

// Helper to safely parse JSON
const safeJsonParse = (text: string | undefined, fallback: any) => {
  if (!text) return fallback;
  try {
    // Attempt to clean markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);
    return result || fallback;
  } catch (e) {
    console.warn("AI JSON Parse Error:", e, text);
    return fallback;
  }
};

// --- PROJECT VISION AI ---

export const improveProjectDescription = async (info: ProjectInfo, category: TokenizationCategory): Promise<string> => {
  try {
    const prompt = IMPROVE_DESCRIPTION_PROMPT(info, category);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text.trim();
  } catch (e) {
    console.error("Improve Description Failed", e);
    return info.description; // Fallback to original
  }
};

// --- JURISDICTION MATCHMAKER (NEW) ---

export interface MatchmakerResult {
  jurisdiction: string;
  entityType: string;
  reasoning: string;
  complianceNote: string;
  pros: string[];
  cons: string[];
}

export const getJurisdictionRecommendation = async (prefs: MatchmakerPreferences): Promise<MatchmakerResult | null> => {
  try {
    const prompt = MATCHMAKER_PROMPT(prefs);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, null);
  } catch (e) {
    console.error("Matchmaker Failed", e);
    return null;
  }
};

// --- LEGAL EDUCATION HELPERS ---

export const getSpvExplanation = async (persona: string): Promise<string> => {
  try {
    const prompt = EXPLAIN_SPV_PROMPT(persona);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Unable to explain SPV at this time.";
  } catch (e) {
    console.error("SPV Explanation Failed", e);
    return "AI Service Unavailable.";
  }
};

export const getJurisdictionSummary = async (region: string): Promise<string> => {
  try {
    const prompt = JURISDICTION_SUMMARY_PROMPT(region);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Unable to summarize jurisdiction.";
  } catch (e) {
    console.error("Jurisdiction Summary Failed", e);
    return "AI Service Unavailable.";
  }
};

export const getGeneralRequirements = async (assetType: string): Promise<string[]> => {
  try {
    const prompt = GENERAL_REQUIREMENTS_PROMPT(assetType);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const parsed = safeJsonParse(response.text, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Requirements Checklist Failed", e);
    return ["Legal Entity", "Asset Proof", "Digital Wallet", "KYC Provider", "Bank Account"];
  }
};

// --- CASE STUDY GENERATOR (NEW) ---

export interface CaseStudy {
  title: string;
  location: string;
  year: string;
  assetValue: string;
  summary: string;
  keyTakeaway: string;
  successFactor: string;
}

export const generateCaseStudy = async (industry: string): Promise<CaseStudy | null> => {
  try {
    const prompt = GENERATE_CASE_STUDY_PROMPT(industry);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, null);
  } catch (e) {
    console.error("Case Study Generation Failed", e);
    return null;
  }
};

// --- TOKENIZABILITY CHECKER ---

export interface TokenizabilityReport {
  isTokenizable: boolean;
  confidenceScore: number;
  recommendedStructure: string;
  mainVerdict: string;
  analysisPoints: string[];
  nextSteps: string;
}

export const checkTokenizability = async (description: string, category?: string): Promise<TokenizabilityReport | null> => {
  try {
    const prompt = CHECK_TOKENIZABILITY_PROMPT(description, category);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, null);
  } catch (e) {
    console.error("Tokenizability Check Failed", e);
    return null;
  }
};

// --- EDUCATION & QUIZ ---

export const generateQuiz = async (topic: string): Promise<QuizData | null> => {
  try {
    const prompt = GENERATE_QUIZ_PROMPT(topic);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, null);
  } catch (e) {
    console.error("Quiz Generation Failed", e);
    return null;
  }
};

// --- TOKENOMICS & STRATEGY ---

export const generateTokenomicsModel = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData): Promise<Partial<TokenomicsData> & { educationalNote?: string }> => {
  try {
    const prompt = GENERATE_TOKENOMICS_PROMPT(asset, project, jurisdiction);
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return safeJsonParse(response.text, {});
  } catch (e) {
    console.error("Tokenomics Generation Failed", e);
    return {};
  }
};

export const generateTokenStrategy = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData) => {
  try {
    const prompt = GENERATE_TOKEN_STRATEGY_PROMPT(asset, project, jurisdiction);
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return safeJsonParse(response.text, {
      whyTokenize: ["Increased Liquidity", "Global Access", "Automated Compliance"],
      taxStrategy: "Consult a local tax advisor.",
      marketPositioning: "High yield asset.",
      educationalNote: "Tokenomics defines the supply and demand mechanics."
    });
  } catch (e) {
    console.error("Strategy Generation Failed", e);
    return null;
  }
};

// --- AUTO FILL ASSETS ---

export const autoFillAssetGeneral = async (info: ProjectInfo, category: TokenizationCategory): Promise<Partial<AssetData>> => {
  try {
    const prompt = AUTOFILL_ASSET_GENERAL_PROMPT(info, category);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, {});
  } catch (e) {
    console.error("Auto-fill Asset General failed", e);
    return {};
  }
};

export const autoFillAssetFinancials = async (info: ProjectInfo, category: TokenizationCategory, valuation: number): Promise<any> => {
  try {
    const prompt = AUTOFILL_ASSET_FINANCIALS_PROMPT(info, category, valuation);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, {});
  } catch (e) {
    console.error("Auto-fill Asset Financials failed", e);
    return {};
  }
};

// --- JURISDICTION AI ---

export const getRegionRecommendations = async (country: string, category: TokenizationCategory): Promise<string[]> => {
  try {
    const prompt = GET_REGION_RECOMMENDATIONS_PROMPT(country, category);
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const parsed = safeJsonParse(response.text, []);
    // Strict Check: Ensure it is an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Region Recommendation Error:", error);
    // Fallback defaults strict by country
    if (country === 'US') return ['Delaware', 'Wyoming', 'New York', 'Texas'];
    if (country === 'AE') return ['DIFC', 'ADGM', 'Dubai Mainland', 'RAK'];
    if (country === 'IT') return ['Milan', 'Rome', 'Trento', 'Turin'];
    if (country === 'UK') return ['London', 'Edinburgh', 'Manchester', 'Leeds'];
    if (country === 'DE') return ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'];
    return [];
  }
};

export const getSpvRecommendation = async (country: string, region: string, category: TokenizationCategory, projectInfo?: ProjectInfo) => {
  try {
    const prompt = RECOMMEND_SPV_PROMPT(country, region, category, projectInfo);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(response.text, { recommendedSpvId: '', reasoning: 'AI analysis unavailable.' });
  } catch (e) {
    return { recommendedSpvId: '', reasoning: 'AI suggestion unavailable.' };
  }
};

export const generateEntityDetails = async (country: string, region: string, spvType: string, assetName: string): Promise<Partial<EntityDetails>> => {
  try {
    const prompt = GENERATE_ENTITY_DETAILS_PROMPT(country, region, spvType, assetName);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const raw = safeJsonParse(response.text, {});
    
    // Sanitize Response to prevent crashes
    return {
        companyName: raw.companyName || `${assetName} ${spvType}`,
        // Ensure strictly number
        shareCapital: typeof raw.shareCapital === 'number' ? raw.shareCapital : parseFloat(raw.shareCapital) || 0,
        registeredAddress: raw.registeredAddress || 'Pending Address',
        // Ensure strictly array
        directors: Array.isArray(raw.directors) ? raw.directors : [], 
        formationAgent: raw.formationAgent || ''
    };

  } catch (e) {
    console.error("Auto-fill failed", e);
    return {};
  }
};

export const analyzeJurisdiction = async (
    country: string, 
    spvType: string, 
    category: TokenizationCategory,
    entityDetails?: EntityDetails,
    projectInfo?: ProjectInfo
): Promise<AiResponse> => {
  try {
    const region = entityDetails?.registrationState || '';
    const prompt = ANALYZE_JURISDICTION_PROMPT(country, region, spvType, category, entityDetails, projectInfo);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restrictions: { type: Type.STRING },
            minDocs: { type: Type.ARRAY, items: { type: Type.STRING } },
            geoBlocking: { type: Type.STRING },
            riskNote: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = safeJsonParse(response.text, {});
    
    return {
        restrictions: parsed.restrictions || "Analysis pending.",
        minDocs: Array.isArray(parsed.minDocs) ? parsed.minDocs : [],
        geoBlocking: parsed.geoBlocking || "Consult local laws.",
        riskNote: parsed.riskNote || "No specific risk identified."
    };

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return {
      restrictions: "Unable to connect to AI consultant.",
      minDocs: ["Standard Incorporation Docs"],
      geoBlocking: "Check local regulations.",
      riskNote: "Proceed with caution."
    };
  }
};

// --- ASSET & FINANCIALS AI ---

export const analyzeAssetFinancials = async (data: AssetData): Promise<AiResponse> => {
  try {
    const prompt = ANALYZE_FINANCIALS_PROMPT(data);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const parsed = safeJsonParse(response.text, {});
    return {
        text: parsed.text || "Financial analysis unavailable.",
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
    };

  } catch (error) {
    return {
      text: "Financial analysis unavailable.",
      risks: ["Check valuation methodology."],
      recommendations: ["Verify NOI against local comparables."]
    };
  }
};

// --- BUSINESS PLAN GENERATOR ---

export const generateBusinessPlan = async (asset: AssetData, projectInfo: ProjectInfo): Promise<string> => {
  try {
    const prompt = GENERATE_BUSINESS_PLAN_PROMPT(asset, projectInfo);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      // No schema for raw text generation, though we want markdown
    });

    return response.text || "Business plan generation failed.";
  } catch (error) {
    console.error("Business Plan Gen Error:", error);
    return "Unable to generate business plan at this time. Please try again later.";
  }
};

// --- RISK REPORT GENERATOR ---

export const generateRiskReport = async (state: TokenizationState): Promise<AiRiskReport> => {
  try {
    const prompt = GENERATE_RISK_REPORT_PROMPT(state);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            level: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            legalRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const parsed = safeJsonParse(response.text, {});
    return {
        score: typeof parsed.score === 'number' ? parsed.score : 50,
        level: (parsed.level === 'Low' || parsed.level === 'Medium' || parsed.level === 'High') ? parsed.level : 'Medium',
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        legalRoadmap: Array.isArray(parsed.legalRoadmap) ? parsed.legalRoadmap : []
    };

  } catch (error) {
    console.error("Risk Report Error:", error);
    return {
        score: 0,
        level: 'High',
        warnings: ["AI Analysis Failed"],
        opportunities: [],
        legalRoadmap: []
    };
  }
};
