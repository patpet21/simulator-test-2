import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JurisdictionData, AssetData, TokenizationCategory, AiRiskReport, EntityDetails, ProjectInfo, TokenizationState, TokenomicsData, QuizData } from '../types';
import { MatchmakerPreferences, MATCHMAKER_PROMPT } from '../prompts/matchmakerPrompts';
import { IMPROVE_DESCRIPTION_PROMPT } from '../prompts/projectPrompts';
import { EXPLAIN_SPV_PROMPT, JURISDICTION_SUMMARY_PROMPT, GENERAL_REQUIREMENTS_PROMPT } from '../prompts/legalEducationPrompts';
import { GENERATE_CASE_STUDY_PROMPT } from '../prompts/caseStudyPrompts';
import { CHECK_TOKENIZABILITY_PROMPT } from '../prompts/tokenizabilityPrompts';
import { GENERATE_QUIZ_PROMPT } from '../prompts/educationPrompts';
import { GENERATE_TOKENOMICS_PROMPT } from '../prompts/tokenomicsPrompts';
import { GENERATE_TOKEN_STRATEGY_PROMPT } from '../prompts/strategyPrompts';
import { AUTOFILL_ASSET_GENERAL_PROMPT, AUTOFILL_ASSET_FINANCIALS_PROMPT } from '../prompts/assetPrompts';
import { GET_REGION_RECOMMENDATIONS_PROMPT, RECOMMEND_SPV_PROMPT, GENERATE_ENTITY_DETAILS_PROMPT, ANALYZE_JURISDICTION_PROMPT } from '../prompts/jurisdictionPrompts';
import { ANALYZE_FINANCIALS_PROMPT } from '../prompts/financialPrompts';
import { GENERATE_BUSINESS_PLAN_PROMPT } from '../prompts/businessPlanPrompt';
import { GENERATE_RISK_REPORT_PROMPT } from '../prompts/riskPrompts';

// Initialize the real Gemini API client
// Note: process.env.API_KEY must be configured in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to clean JSON strings from Markdown code blocks
function cleanJson(text: string): string {
  return text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
}

// Helper to reliably parse JSON from AI response
async function generateJSON<T>(model: string, prompt: string, schema: Schema, fallback: T): Promise<T> {
  if (!process.env.API_KEY) {
    console.warn("AI Service: No API Key found. Using fallback.");
    return fallback;
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    const text = response.text || '{}';
    return JSON.parse(cleanJson(text)) as T;
  } catch (e) {
    console.error("AI Generation Error:", e);
    return fallback;
  }
}

// Helper for text generation
async function generateText(model: string, prompt: string, fallback: string): Promise<string> {
  if (!process.env.API_KEY) return fallback;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || fallback;
  } catch (e) {
    console.error("AI Text Generation Error:", e);
    return fallback;
  }
}

// --- PROJECT VISION AI ---

export const improveProjectDescription = async (info: ProjectInfo, category: TokenizationCategory): Promise<string> => {
  return generateText(
    'gemini-2.5-flash',
    IMPROVE_DESCRIPTION_PROMPT(info, category),
    info.description
  );
};

// --- JURISDICTION MATCHMAKER ---

export interface MatchmakerResult {
  jurisdiction: string;
  entityType: string;
  reasoning: string;
  complianceNote: string;
  pros: string[];
  cons: string[];
}

export const getJurisdictionRecommendation = async (prefs: MatchmakerPreferences): Promise<MatchmakerResult | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      jurisdiction: { type: Type.STRING },
      entityType: { type: Type.STRING },
      reasoning: { type: Type.STRING },
      complianceNote: { type: Type.STRING },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };

  return generateJSON<MatchmakerResult | null>(
    'gemini-2.5-flash',
    MATCHMAKER_PROMPT(prefs),
    schema,
    null
  );
};

// --- LEGAL EDUCATION HELPERS ---

export const getSpvExplanation = async (persona: string): Promise<string> => {
  return generateText(
    'gemini-2.5-flash',
    EXPLAIN_SPV_PROMPT(persona),
    "An SPV is a separate company created to hold the asset, protecting investors."
  );
};

export const getJurisdictionSummary = async (region: string): Promise<string> => {
  return generateText(
    'gemini-2.5-flash',
    JURISDICTION_SUMMARY_PROMPT(region),
    `${region} offers specific regulations for digital assets.`
  );
};

export const getGeneralRequirements = async (assetType: string): Promise<string[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  };
  return generateJSON<string[]>(
    'gemini-2.5-flash',
    GENERAL_REQUIREMENTS_PROMPT(assetType),
    schema,
    ["Legal Entity", "Asset Title", "Compliance Provider"]
  );
};

// --- CASE STUDY GENERATOR ---

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
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      location: { type: Type.STRING },
      year: { type: Type.STRING },
      assetValue: { type: Type.STRING },
      summary: { type: Type.STRING },
      keyTakeaway: { type: Type.STRING },
      successFactor: { type: Type.STRING }
    }
  };
  return generateJSON<CaseStudy | null>(
    'gemini-2.5-flash',
    GENERATE_CASE_STUDY_PROMPT(industry),
    schema,
    null
  );
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
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isTokenizable: { type: Type.BOOLEAN },
      confidenceScore: { type: Type.NUMBER },
      recommendedStructure: { type: Type.STRING },
      mainVerdict: { type: Type.STRING },
      analysisPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      nextSteps: { type: Type.STRING }
    }
  };
  
  return generateJSON<TokenizabilityReport | null>(
    'gemini-2.5-flash',
    CHECK_TOKENIZABILITY_PROMPT(description, category),
    schema,
    null
  );
};

// --- EDUCATION & QUIZ ---

export const generateQuiz = async (topic: string): Promise<QuizData | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    }
  };
  
  return generateJSON<QuizData | null>(
    'gemini-2.5-flash',
    GENERATE_QUIZ_PROMPT(topic),
    schema,
    null
  );
};

// --- TOKENOMICS & STRATEGY ---

export const generateTokenomicsModel = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData): Promise<Partial<TokenomicsData> & { educationalNote?: string }> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      tokenName: { type: Type.STRING },
      tokenSymbol: { type: Type.STRING },
      totalSupply: { type: Type.NUMBER },
      pricePerToken: { type: Type.NUMBER },
      vestingSchedule: { type: Type.STRING },
      educationalNote: { type: Type.STRING },
      allocation: {
        type: Type.OBJECT,
        properties: {
          founders: { type: Type.NUMBER },
          investors: { type: Type.NUMBER },
          treasury: { type: Type.NUMBER },
          advisors: { type: Type.NUMBER },
        }
      }
    }
  };

  return generateJSON(
    'gemini-3-pro-preview', // Use Pro for complex math/reasoning
    GENERATE_TOKENOMICS_PROMPT(asset, project, jurisdiction),
    schema,
    { tokenName: 'Token', tokenSymbol: 'TKN', totalSupply: 1000000, pricePerToken: 1 }
  );
};

export const generateTokenStrategy = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData) => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      whyTokenize: { type: Type.ARRAY, items: { type: Type.STRING } },
      taxStrategy: { type: Type.STRING },
      marketPositioning: { type: Type.STRING },
      educationalNote: { type: Type.STRING }
    }
  };

  return generateJSON(
    'gemini-2.5-flash',
    GENERATE_TOKEN_STRATEGY_PROMPT(asset, project, jurisdiction),
    schema,
    { whyTokenize: [], taxStrategy: "Consult a tax professional.", marketPositioning: "Growth", educationalNote: "" }
  );
};

// --- AUTO FILL ASSETS ---

export const autoFillAssetGeneral = async (info: ProjectInfo, category: TokenizationCategory): Promise<Partial<AssetData>> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      assetName: { type: Type.STRING },
      valuation: { type: Type.NUMBER },
      assetType: { type: Type.STRING },
      industry: { type: Type.STRING },
      sqft: { type: Type.NUMBER },
      address: { type: Type.STRING },
      description: { type: Type.STRING }
    }
  };

  return generateJSON(
    'gemini-2.5-flash',
    AUTOFILL_ASSET_GENERAL_PROMPT(info, category),
    schema,
    {}
  );
};

export const autoFillAssetFinancials = async (info: ProjectInfo, category: TokenizationCategory, valuation: number): Promise<any> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      noi: { type: Type.NUMBER },
      revenue: { type: Type.NUMBER },
      ebitda: { type: Type.NUMBER },
      occupancyRate: { type: Type.NUMBER },
      existingDebt: { type: Type.NUMBER }
    }
  };

  return generateJSON(
    'gemini-2.5-flash',
    AUTOFILL_ASSET_FINANCIALS_PROMPT(info, category, valuation),
    schema,
    {}
  );
};

// --- JURISDICTION AI ---

export const getRegionRecommendations = async (country: string, category: TokenizationCategory): Promise<string[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  };
  return generateJSON(
    'gemini-2.5-flash',
    GET_REGION_RECOMMENDATIONS_PROMPT(country, category),
    schema,
    []
  );
};

export const getSpvRecommendation = async (country: string, region: string, category: TokenizationCategory, projectInfo?: ProjectInfo) => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      recommendedSpvId: { type: Type.STRING },
      reasoning: { type: Type.STRING }
    }
  };
  return generateJSON(
    'gemini-2.5-flash',
    RECOMMEND_SPV_PROMPT(country, region, category, projectInfo),
    schema,
    { recommendedSpvId: 'LLC', reasoning: 'Standard flexibility.' }
  );
};

export const generateEntityDetails = async (country: string, region: string, spvType: string, assetName: string): Promise<Partial<EntityDetails>> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      companyName: { type: Type.STRING },
      shareCapital: { type: Type.NUMBER },
      registeredAddress: { type: Type.STRING },
      directors: { type: Type.ARRAY, items: { type: Type.STRING } },
      formationAgent: { type: Type.STRING }
    }
  };
  return generateJSON(
    'gemini-2.5-flash',
    GENERATE_ENTITY_DETAILS_PROMPT(country, region, spvType, assetName),
    schema,
    {}
  );
};

export interface AiResponse {
  text?: string;
  risks?: string[];
  recommendations?: string[];
  restrictions?: string;
  minDocs?: string[];
  geoBlocking?: string;
  riskNote?: string;
}

export const analyzeJurisdiction = async (
    country: string, 
    spvType: string, 
    category: TokenizationCategory,
    entityDetails?: EntityDetails,
    projectInfo?: ProjectInfo
): Promise<AiResponse> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      restrictions: { type: Type.STRING },
      minDocs: { type: Type.ARRAY, items: { type: Type.STRING } },
      geoBlocking: { type: Type.STRING },
      riskNote: { type: Type.STRING }
    }
  };
  return generateJSON(
    'gemini-2.5-flash',
    ANALYZE_JURISDICTION_PROMPT(country, entityDetails?.registrationState || '', spvType, category, entityDetails, projectInfo),
    schema,
    { text: "Analysis unavailable." }
  );
};

// --- ASSET & FINANCIALS AI ---

export const analyzeAssetFinancials = async (data: AssetData): Promise<AiResponse> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };
  return generateJSON(
    'gemini-2.5-flash',
    ANALYZE_FINANCIALS_PROMPT(data),
    schema,
    { text: "Financial analysis unavailable." }
  );
};

// --- BUSINESS PLAN GENERATOR ---

export const generateBusinessPlan = async (asset: AssetData, projectInfo: ProjectInfo): Promise<string> => {
  // Pro model for long form content
  return generateText(
    'gemini-3-pro-preview',
    GENERATE_BUSINESS_PLAN_PROMPT(asset, projectInfo),
    "# Executive Summary\n\nGeneration failed."
  );
};

// --- RISK REPORT GENERATOR ---

export const generateRiskReport = async (state: TokenizationState): Promise<AiRiskReport> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
      legalRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };
  
  return generateJSON(
    'gemini-3-pro-preview',
    GENERATE_RISK_REPORT_PROMPT(state),
    schema,
    { score: 50, level: 'Medium', warnings: [], opportunities: [], legalRoadmap: [] }
  );
};
