import { JurisdictionData, AssetData, TokenizationCategory, AiRiskReport, EntityDetails, ProjectInfo, TokenizationState, TokenomicsData, QuizData } from '../types';
import { MatchmakerPreferences } from '../prompts/matchmakerPrompts';

// --- MOCK SERVICE (No External API Dependency) ---
// This service simulates AI analysis to ensure stable deployment without dependency issues.

export interface AiResponse {
  text?: string;
  risks?: string[];
  recommendations?: string[];
  restrictions?: string;
  minDocs?: string[];
  geoBlocking?: string;
  riskNote?: string;
}

const simulateDelay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// --- PROJECT VISION AI ---

export const improveProjectDescription = async (info: ProjectInfo, category: TokenizationCategory): Promise<string> => {
  await simulateDelay(1500);
  return `${info.projectName} represents a high-value opportunity in the ${category} sector. This project aims to leverage blockchain technology to provide ${info.projectGoal}, offering investors transparent access to a premium asset class with calculated risk-adjusted returns. The strategy focuses on maximizing capital efficiency while ensuring full regulatory compliance.`;
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
  await simulateDelay(1200);
  
  if (prefs.investorType.includes('Retail')) {
      return {
          jurisdiction: "United States (Reg A+)",
          entityType: "C-Corp or LLC",
          reasoning: "Since you are targeting Retail investors, US Regulation A+ is the gold standard. It allows you to raise up to $75M from the general public, though it requires SEC qualification.",
          complianceNote: "Requires filing Form 1-A with the SEC.",
          pros: ["Access to general public", "Unlimited investors", "High trust"],
          cons: ["High cost ($50k+)", "Slow setup (3-5 months)"]
      };
  } else if (prefs.capitalSource.includes('Crypto')) {
      return {
          jurisdiction: "UAE (ADGM/DIFC)",
          entityType: "Special Purpose Vehicle (SPV)",
          reasoning: "For crypto-native capital, the UAE offers the most forward-thinking regulatory framework (VARA/FSRA). ADGM specifically has robust digital asset guidance.",
          complianceNote: "Must appoint a local corporate service provider.",
          pros: ["0% Corporate Tax", "Crypto-friendly banks", "English Common Law"],
          cons: ["High maintenance costs", "Strict AML reporting"]
      };
  }

  return {
      jurisdiction: "United States (Delaware)",
      entityType: "Series LLC",
      reasoning: "For a balance of speed and investor protection, a Delaware Series LLC is the standard. It allows for segregating assets into individual series, protecting them from each other's liabilities.",
      complianceNote: "File Form D within 15 days of first sale.",
      pros: ["Rapid setup", "Strong legal precedents", "Flexible management"],
      cons: ["Annual Franchise Tax", "Not tax-efficient for non-US founders"]
  };
};

// --- LEGAL EDUCATION HELPERS ---

export const getSpvExplanation = async (persona: string): Promise<string> => {
  await simulateDelay(800);
  if (persona === 'Beginner') return "Imagine a safe box. You put the house inside the safe box. Investors don't own the house directly; they own keys to the safe box. The SPV is that safe box—it protects the asset.";
  if (persona === 'Crypto Native') return "It's like a multisig wallet for the real world. The SPV is the legal wrapper (smart contract owner) that holds title to the asset, ensuring off-chain enforceability of on-chain tokens.";
  return "A Special Purpose Vehicle (SPV) is a subsidiary company formed strictly to hold a specific asset. It isolates financial risk, so if the parent company goes bankrupt, this asset remains safe for its investors.";
};

export const getJurisdictionSummary = async (region: string): Promise<string> => {
  await simulateDelay(800);
  if (region.includes('USA')) return "The US offers the deepest capital markets via Reg D and Reg S exemptions. It is highly prestigious but comes with strict SEC oversight. The main downside is the complexity of excluding non-accredited investors.";
  if (region.includes('UAE')) return "The UAE is a global leader for digital assets with 0% tax zones like ADGM. It offers a crypto-native environment with clear rulebooks. However, operational costs for substance can be high.";
  if (region.includes('Europe')) return "Europe offers market access to 450M people via the new MiCA regulation. It provides high legal certainty and consumer protection. The downside is fragmented implementation across member states.";
  return "This jurisdiction offers a developing framework for digital assets. It may offer lower costs and speed. However, investor protection laws may be less tested than in Tier-1 financial hubs.";
};

export const getGeneralRequirements = async (assetType: string): Promise<string[]> => {
  await simulateDelay(800);
  return ["Legal Entity (SPV)", "Clean Title Deed", "KYC/AML Provider"];
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
  await simulateDelay(1500);
  return {
      title: `${industry} Alpha Prime`,
      location: "Aspen, USA",
      year: "2020",
      assetValue: "$18.5M",
      summary: `A landmark tokenization of a high-value ${industry} asset. The project raised capital from 500+ accredited investors globally, offering a digital share of equity.`,
      keyTakeaway: "Liquidity premiums can be realized even in illiquid sectors.",
      successFactor: "Partnership with a regulated broker-dealer."
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
  await simulateDelay(2000);
  
  const isValid = description.length > 20;
  
  return {
      isTokenizable: isValid,
      confidenceScore: isValid ? 92 : 45,
      recommendedStructure: category === 'Real Estate' ? "Delaware LLC or German GmbH" : "Special Purpose Vehicle (SPV)",
      mainVerdict: isValid 
        ? "Yes, this asset is a prime candidate for tokenization." 
        : "Unclear. We need more details on valuation and cash flow.",
      analysisPoints: [
          "Asset has clear intrinsic value potential.",
          "Legal ownership appears transferable to an SPV.",
          "Cash flow generation supports a dividend model."
      ],
      nextSteps: isValid 
        ? "Proceed to the 'Jurisdiction' step to select your legal wrapper."
        : "Please refine the description with specific valuation figures."
  };
};

// --- EDUCATION & QUIZ ---

export const generateQuiz = async (topic: string): Promise<QuizData | null> => {
  await simulateDelay(1000);
  return {
      topic,
      questions: [
          {
              question: `What is the primary benefit of tokenizing ${topic}?`,
              options: ["Instant Liquidity", "Avoiding Taxes", "Anonymous Trading", "None of the above"],
              correctIndex: 0,
              explanation: "Tokenization allows fractional ownership, enabling assets to be traded more easily on secondary markets."
          },
          {
              question: "Which document defines the legal rights of a token holder?",
              options: ["The Whitepaper", "The Smart Contract Code", "The Subscription Agreement", "The Marketing Deck"],
              correctIndex: 2,
              explanation: "The Subscription Agreement (or Offering Memo) is the legally binding contract between issuer and investor."
          },
          {
              question: "Why is an SPV usually required?",
              options: ["To pay more fees", "To isolate liability and hold the asset", "It is not required", "To hide the owner"],
              correctIndex: 1,
              explanation: "An SPV separates the asset's risk from the parent company and provides a clean legal container for the tokens."
          }
      ]
  };
};

// --- TOKENOMICS & STRATEGY ---

export const generateTokenomicsModel = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData): Promise<Partial<TokenomicsData> & { educationalNote?: string }> => {
  await simulateDelay(1500);
  const supply = 1000000;
  const price = (asset.valuation || 1000000) / supply;
  
  return {
      tokenName: `${asset.assetName || 'Asset'} Token`,
      tokenSymbol: (asset.assetName?.substring(0,3) || 'AST').toUpperCase(),
      totalSupply: supply,
      pricePerToken: price,
      vestingSchedule: "1 Year Cliff, 4 Year Linear",
      allocation: { founders: 15, investors: 70, treasury: 10, advisors: 5 },
      educationalNote: "We recommend a 15% founder allocation to align incentives, with a 1-year cliff to demonstrate long-term commitment to investors."
  };
};

export const generateTokenStrategy = async (asset: AssetData, project: ProjectInfo, jurisdiction: JurisdictionData) => {
  await simulateDelay(1500);
  return {
      whyTokenize: [
          "Unlock liquidity for early investors.",
          "Access a global pool of capital beyond local banks.",
          "Automate compliance and dividend distribution."
      ],
      taxStrategy: `In ${jurisdiction.country}, utilizing a pass-through entity like the ${jurisdiction.spvType || 'SPV'} avoids double taxation on corporate profits.`,
      marketPositioning: "Position this as a 'Yield + Growth' hybrid token. Highlight the stability of the underlying asset combined with the efficiency of blockchain settlement.",
      educationalNote: "Tokenomics is not just math; it is incentive design. A well-structured vesting schedule builds trust."
  };
};

// --- AUTO FILL ASSETS ---

export const autoFillAssetGeneral = async (info: ProjectInfo, category: TokenizationCategory): Promise<Partial<AssetData>> => {
  await simulateDelay(1000);
  return {
      assetName: info.projectName || "Prime Asset",
      valuation: info.targetRaiseAmount ? info.targetRaiseAmount * 1.5 : 5000000,
      assetType: "Commercial",
      industry: "Real Estate",
      sqft: 25000,
      address: "123 Innovation Blvd, Tech City",
      description: `A premium ${category} asset focused on ${info.projectGoal}. High potential for growth and stable yield generation.`
  };
};

export const autoFillAssetFinancials = async (info: ProjectInfo, category: TokenizationCategory, valuation: number): Promise<any> => {
  await simulateDelay(1000);
  return {
      noi: valuation * 0.08, // 8% Cap Rate estimate
      revenue: valuation * 0.15,
      ebitda: valuation * 0.10,
      occupancyRate: 92,
      existingDebt: valuation * 0.4 // 40% LTV
  };
};

// --- JURISDICTION AI ---

export const getRegionRecommendations = async (country: string, category: TokenizationCategory): Promise<string[]> => {
  await simulateDelay(600);
  if (country === 'US') return ['Delaware', 'Wyoming', 'New York', 'Texas'];
  if (country === 'AE') return ['DIFC', 'ADGM', 'Dubai Mainland', 'RAK ICC'];
  if (country === 'IT') return ['Milan', 'Rome', 'Trento', 'Turin'];
  if (country === 'UK') return ['London', 'Edinburgh', 'Manchester', 'Leeds'];
  if (country === 'DE') return ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'];
  return ['Capital City', 'Financial District'];
};

export const getSpvRecommendation = async (country: string, region: string, category: TokenizationCategory, projectInfo?: ProjectInfo) => {
  await simulateDelay(1000);
  let rec = "Standard LLC";
  if (country === 'US') rec = "Delaware Series LLC";
  if (country === 'AE') rec = "ADGM SPV";
  if (country === 'IT') rec = "S.r.l.";
  if (country === 'DE') rec = "GmbH";
  if (country === 'UK') rec = "Private Ltd";

  return { 
      recommendedSpvId: rec, 
      reasoning: `Based on your goal of '${projectInfo?.projectGoal}', the ${rec} offers the best balance of liability protection and operational flexibility in ${region || country}.` 
  };
};

export const generateEntityDetails = async (country: string, region: string, spvType: string, assetName: string): Promise<Partial<EntityDetails>> => {
  await simulateDelay(1200);
  return {
      companyName: `${assetName.replace(/\s+/g, '')} ${spvType}`,
      shareCapital: 10000,
      registeredAddress: `123 Ledger Lane, ${region}, ${country}`,
      directors: ["Alice Founder", "Bob Director"],
      formationAgent: "Global Corporate Services Ltd"
  };
};

export const analyzeJurisdiction = async (
    country: string, 
    spvType: string, 
    category: TokenizationCategory,
    entityDetails?: EntityDetails,
    projectInfo?: ProjectInfo
): Promise<AiResponse> => {
  await simulateDelay(2000);
  return {
      restrictions: `In ${country}, a ${spvType} cannot publicly solicit retail investors without a registered prospectus (or relying on an exemption like Reg A+ / Crowdfunding).`,
      minDocs: ["Articles of Association", "Memorandum of Understanding", "Director Resolution", "KYC Manual"],
      geoBlocking: "We recommend geo-blocking sanctioned countries (OFAC list) and potentially US retail investors if using Reg S.",
      riskNote: "Ensure your 'Registered Office' is maintained annually to avoid involuntary dissolution by the state registry."
  };
};

// --- ASSET & FINANCIALS AI ---

export const analyzeAssetFinancials = async (data: AssetData): Promise<AiResponse> => {
  await simulateDelay(1500);
  return {
      text: `The asset shows strong fundamentals with a valuation of $${data.valuation?.toLocaleString()}. The debt level appears manageable.`,
      risks: [
          "Interest rate sensitivity if debt is variable.",
          "Market liquidity for this specific asset class.",
          "Operational costs exceeding projections."
      ],
      recommendations: [
          "Consider fixing debt interest rates.",
          "Maintain a 6-month operating reserve in the SPV.",
          "Conduct a third-party appraisal before token issuance."
      ]
  };
};

// --- BUSINESS PLAN GENERATOR ---

export const generateBusinessPlan = async (asset: AssetData, projectInfo: ProjectInfo): Promise<string> => {
  await simulateDelay(2500);
  return `
# Executive Summary
${projectInfo.projectName} offers a unique opportunity to participate in a high-value ${asset.category} asset located in ${asset.address || 'a prime location'}. By leveraging blockchain technology, we are democratizing access to this traditionally illiquid investment.

# Investment Opportunity
The ${asset.category} market has shown resilient growth. This asset, valued at $${asset.valuation?.toLocaleString()}, is positioned to capitalize on local demand drivers. Our strategy focuses on ${projectInfo.projectGoal}, delivering value through active management and technological efficiency.

# Financial Projections
Based on a valuation of $${asset.valuation?.toLocaleString()}, we project steady cash flows.
- **Projected Revenue:** Stable yield generation via lease/commercial activities.
- **Expense Ratio:** Optimized through digital management and reduced intermediaries.
- **Target Returns:** Competitive risk-adjusted APY.

# Exit Strategy
We aim to provide liquidity through:
1. **Secondary Market Trading:** Listing tokens on regulated ATS/MTF platforms.
2. **Refinancing:** Returning capital to investors upon asset stabilization.
3. **Strategic Sale:** Disposition of the asset at the end of the holding period (5-7 years).
  `;
};

// --- RISK REPORT GENERATOR ---

export const generateRiskReport = async (state: TokenizationState): Promise<AiRiskReport> => {
  await simulateDelay(2000);
  const score = state.compliance.regFramework === 'None' ? 45 : 88;
  
  return {
      score: score,
      level: score > 80 ? 'Low' : 'Medium',
      warnings: [
          "Ensure secondary market trading venues support your token standard.",
          "Verify tax withholding requirements for international investors."
      ],
      opportunities: [
          "Expand investor base to Asia/EU via Reg S.",
          "Enable DeFi collateralization for instant liquidity."
      ],
      legalRoadmap: [
          "Incorporate SPV in selected jurisdiction.",
          "Draft Offering Memorandum & Subscription Agreement.",
          "Deploy Smart Contracts & White-list Investors.",
          "Launch Primary Sale."
      ]
  };
};
