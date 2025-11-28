import { JurisdictionData, AssetData, TokenizationCategory, AiRiskReport, EntityDetails, ProjectInfo, TokenizationState, TokenomicsData, QuizData } from '../types';
import { MatchmakerPreferences } from '../prompts/matchmakerPrompts';

// --- MOCK SERVICE IMPLEMENTATION ---
// This file replaces the AI SDK with local logic to ensure the app runs 100% offline/without keys.

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- PROJECT VISION AI ---

export const improveProjectDescription = async (info: ProjectInfo, category: TokenizationCategory): Promise<string> => {
  await delay(1500);
  const prefix = "This investment opportunity presents a unique value proposition via blockchain fractionalization. ";
  return prefix + (info.description || `A premium ${category} asset located in a prime market, offering investors exposure to stable yields and long-term capital appreciation through a compliant digital structure.`);
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
  await delay(2000);
  
  // Simple logic based on preferences
  if (prefs.assetLocation === 'Domestic' && prefs.investorType.includes('Retail')) {
      return {
          jurisdiction: "United States (Reg A+)",
          entityType: "Series LLC",
          reasoning: "For retail access in a domestic setting, Regulation A+ offers the best framework to raise capital from the general public while maintaining compliance.",
          complianceNote: "Requires a qualification circular filed with the SEC (Form 1-A).",
          pros: ["Unlimited Investors", "General Solicitation Allowed"],
          cons: ["High Setup Costs", "Longer Approval Time"]
      };
  }

  if (prefs.priority.includes('Speed')) {
      return {
          jurisdiction: "United Kingdom",
          entityType: "Private Ltd Company",
          reasoning: "The UK offers the fastest incorporation time globally (24h) and a flexible common law framework ideal for rapid deployment.",
          complianceNote: "Must maintain a PSC (Persons with Significant Control) register.",
          pros: ["24h Setup", "Global Reputation"],
          cons: ["Higher Corporate Tax", "Brexit Uncertainty"]
      };
  }

  // Default to Delaware
  return {
      jurisdiction: "United States (Delaware)",
      entityType: "LLC (Reg D)",
      reasoning: "Delaware is the global standard for corporate law. Using Regulation D 506(c) allows for general solicitation of accredited investors with minimal friction.",
      complianceNote: "Form D must be filed within 15 days of the first sale.",
      pros: ["Flexible Management", "Strong Case Law"],
      cons: ["Franchise Tax", "Accredited Investors Only"]
  };
};

// --- LEGAL EDUCATION HELPERS ---

export const getSpvExplanation = async (persona: string): Promise<string> => {
  await delay(1000);
  switch (persona) {
      case 'Beginner': return "Think of an SPV like a 'bucket' that holds the asset. If the bucket breaks, your other assets are safe. It's a separate company just for this deal.";
      case 'Real Estate Agent': return "An SPV is the holding company on the title deed. It isolates liability so that if a tenant sues, they can't touch the sponsor's personal assets.";
      case 'Crypto Native': return "It's the legal wrapper for the smart contract. The DAO governs the SPV, and the SPV holds the off-chain asset legality.";
      default: return "A Special Purpose Vehicle (SPV) is a subsidiary created for a specific business purpose or activity, primarily to isolate financial risk.";
  }
};

export const getJurisdictionSummary = async (region: string): Promise<string> => {
  await delay(1000);
  if (region.includes("USA")) return "The US offers the deepest capital markets via Reg D but requires strict strict adherence to SEC securities laws. Pros: Access to capital. Cons: High legal costs.";
  if (region.includes("UAE")) return "The UAE (DIFC/ADGM) is highly progressive for crypto assets with specific virtual asset regulations. Pros: 0% Tax possibilities. Cons: Newer framework.";
  if (region.includes("Europe")) return "Europe's MiCA regulation provides a unified framework for crypto assets across 27 countries. Pros: Passporting rights. Cons: Fragmented local securities laws.";
  return `${region} typically follows local civil or common law. Consult a local attorney for specific digital asset regulations.`;
};

export const getGeneralRequirements = async (assetType: string): Promise<string[]> => {
  await delay(1200);
  return ["Clean Title / Proof of Ownership", "SPV Incorporation Documents", "Legal Opinion Letter"];
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
  await delay(1500);
  return {
      title: `${industry} Alpha Fund`,
      location: "New York / Zug",
      year: "2023",
      assetValue: "$45M",
      summary: `A pioneering project that tokenized a portfolio of ${industry} assets to provide liquidity to early investors.`,
      keyTakeaway: "Regulatory compliance was the biggest hurdle but ultimately the biggest value driver.",
      successFactor: "Automated daily dividend distributions via USDC."
  };
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
  await delay(2000);
  const score = Math.floor(Math.random() * (98 - 70 + 1) + 70);
  return {
      isTokenizable: true,
      confidenceScore: score,
      recommendedStructure: "Asset-Backed SPV (LLC)",
      mainVerdict: "This asset is a strong candidate for tokenization due to its tangible value.",
      analysisPoints: [
          "Clear underlying value proposition",
          "Legal title can be held by an SPV",
          "Cash flow potential supports token yield"
      ],
      nextSteps: "Form the legal entity and conduct a third-party valuation."
  };
};

// --- EDUCATION & QUIZ ---

export const generateQuiz = async (topic: string): Promise<QuizData | null> => {
  await delay(1500);
  return {
      topic: topic,
      questions: [
          {
              question: "What is the primary role of an SPV in tokenization?",
              options: ["To avoid all taxes", "To isolate risk and hold the asset", "To generate crypto tokens", "To hire employees"],
              correctIndex: 1,
              explanation: "An SPV (Special Purpose Vehicle) is designed to ring-fence the asset and its liabilities from the parent company."
          },
          {
              question: "Which represents a 'Security Token'?",
              options: ["Bitcoin", "A utility NFT", "Digital share in a real estate LLC", "Ethereum gas fees"],
              correctIndex: 2,
              explanation: "Security tokens represent ownership in an external asset, like shares in a company or real estate."
          },
          {
              question: "Why is KYC important?",
              options: ["It makes the token look cool", "It is required by anti-money laundering laws", "It increases gas fees", "It is optional"],
              correctIndex: 1,
              explanation: "Know Your Customer (KYC) is mandatory for regulated securities to prevent money laundering and ensure investor suitability."
          }
      ]
  };
};

// --- TOKENOMICS & STRATEGY ---

export const generateTokenomicsModel = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData): Promise<Partial<TokenomicsData> & { educationalNote?: string }> => {
  await delay(2000);
  const val = asset.valuation || 1000000;
  const price = val > 1000000 ? 100 : 10;
  const supply = val / price;
  
  return {
      tokenName: `${project.projectName || 'Asset'} Token`,
      tokenSymbol: (project.projectName || 'AST').substring(0,3).toUpperCase(),
      totalSupply: supply,
      pricePerToken: price,
      vestingSchedule: "1 Year Lock-up",
      educationalNote: "We recommended a higher token price ($100+) to attract serious investors and reduce cap table fragmentation.",
      allocation: {
          founders: 10,
          investors: 80,
          treasury: 5,
          advisors: 5
      }
  };
};

export const generateTokenStrategy = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData) => {
  await delay(1500);
  return {
      whyTokenize: [
          "Unlock liquidity from a previously illiquid asset.",
          "Access a global pool of capital beyond local banks.",
          "Automate compliance and distributions via smart contracts."
      ],
      taxStrategy: `Utilize the ${jurisdiction.spvType || 'Entity'} structure to potentially pass-through taxation obligations to individual token holders.`,
      marketPositioning: "Position as a 'Stable Yield' product focusing on the consistent cash flow rather than speculative growth.",
      educationalNote: "Did you know? Tokenized real estate often trades at a premium to NAV due to the liquidity premium."
  };
};

// --- AUTO FILL ASSETS ---

export const autoFillAssetGeneral = async (info: ProjectInfo, category: TokenizationCategory): Promise<Partial<AssetData>> => {
  await delay(1000);
  return {
      assetName: info.projectName || "Prime Asset",
      valuation: 5000000,
      assetType: "Commercial",
      industry: "Real Estate",
      sqft: 15000,
      address: "123 Innovation Blvd, Tech City",
      description: "A high-potential asset located in a growing economic zone."
  };
};

export const autoFillAssetFinancials = async (info: ProjectInfo, category: TokenizationCategory, valuation: number): Promise<any> => {
  await delay(1000);
  const val = valuation || 1000000;
  return {
      noi: val * 0.08, // 8% yield
      revenue: val * 0.15,
      ebitda: val * 0.10,
      occupancyRate: 92,
      existingDebt: val * 0.4 // 40% LTV
  };
};

// --- JURISDICTION AI ---

export const getRegionRecommendations = async (country: string, category: TokenizationCategory): Promise<string[]> => {
  await delay(800);
  if (country === 'US') return ["Delaware", "Wyoming", "Florida"];
  if (country === 'UAE') return ["DIFC", "ADGM", "DMCC"];
  if (country === 'CH') return ["Zug", "Zurich", "Geneva"];
  return ["Capital Region", "Financial District", "Free Trade Zone"];
};

export const getSpvRecommendation = async (country: string, region: string, category: TokenizationCategory, projectInfo?: ProjectInfo) => {
  await delay(1200);
  return {
      recommendedSpvId: country === 'US' ? 'LLC' : country === 'UK' ? 'LTD' : 'SPV',
      reasoning: "This structure offers the best balance of liability protection and tax efficiency for your asset class."
  };
};

export const generateEntityDetails = async (country: string, region: string, spvType: string, assetName: string): Promise<Partial<EntityDetails>> => {
  await delay(1500);
  return {
      companyName: `${assetName} ${spvType} Holdings`,
      shareCapital: 10000,
      registeredAddress: `100 Legal Way, ${region || 'City'}, ${country}`,
      directors: ["John Doe", "Jane Smith"],
      formationAgent: "Global Corp Services Inc."
  };
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
  await delay(2000);
  return {
      restrictions: "Cannot solicit non-accredited investors without a prospectus.",
      minDocs: ["Articles of Organization", "Operating Agreement", "Subscription Agreement"],
      geoBlocking: "Block: North Korea, Iran, Syria. Warning: USA (if not Reg D).",
      riskNote: "Ensure you file all necessary securities exemptions within 15 days of the first sale."
  };
};

// --- ASSET & FINANCIALS AI ---

export const analyzeAssetFinancials = async (data: AssetData): Promise<AiResponse> => {
  await delay(1500);
  return {
      text: "Financials look healthy. Debt service coverage ratio is acceptable.",
      risks: ["Interest rate fluctuation", "Tenant vacancy risk"],
      recommendations: ["Lock in fixed rate debt", "Diversify tenant mix"]
  };
};

// --- BUSINESS PLAN GENERATOR ---

export const generateBusinessPlan = async (asset: AssetData, projectInfo: ProjectInfo): Promise<string> => {
  await delay(2500);
  return `
# Business Plan: ${projectInfo.projectName}

## 1. Executive Summary
This project aims to tokenize **${asset.assetName}**, a ${asset.category} asset valued at **$${asset.valuation?.toLocaleString()}**. By leveraging blockchain technology, we will fractionalize ownership to provide liquidity to existing owners and access to new investors.

## 2. Market Analysis
The ${asset.category} market has shown resilient growth. Demand for fractionalized ownership in high-quality assets is increasing, particularly among digital-native investors seeking yield.

## 3. The Asset
Located at ${asset.address || 'Prime Location'}, this asset features strong fundamentals.
- **Valuation**: $${asset.valuation?.toLocaleString()}
- **Occupancy**: ${asset.financials.occupancyRate || 95}%
- **Projected Yield**: 8-12% APY

## 4. Financial Projections
We project steady cash flow distributions starting in Q2. Revenue is derived primarily from ${asset.category === 'Real Estate' ? 'rental income' : 'business operations'}.

## 5. Exit Strategy
Investors can exit via:
1. Secondary market trading of tokens.
2. Refinancing of the asset in Year 5.
3. Sale of the underlying asset.
`;
};

// --- RISK REPORT GENERATOR ---

export const generateRiskReport = async (state: TokenizationState): Promise<AiRiskReport> => {
  await delay(2500);
  const isCompliant = state.compliance.regFramework !== 'None';
  const hasCapital = (state.tokenomics.softCap || 0) < (state.asset.valuation || 0);
  
  return {
      score: isCompliant ? 85 : 45,
      level: isCompliant ? 'Low' : 'High',
      warnings: isCompliant ? ["Ensure annual audits", "Monitor secondary trading volume"] : ["Regulatory framework undefined", "High compliance risk"],
      opportunities: ["Expand to global investors", "DeFi collateralization"],
      legalRoadmap: ["Incorporate SPV", "Draft Offering Memo", "File Securities Exemption", "Mint Tokens"]
  };
};
