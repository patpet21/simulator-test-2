
// Data Models

export type TokenizationCategory = 'Real Estate' | 'Business' | 'Art' | 'Debt' | 'Funds' | 'Other';

// --- PROJECT INFO (STEP 1) ---
export interface ProjectInfo {
  projectName: string;
  projectGoal: 'Liquidity' | 'Capital Raise' | 'Community' | 'Exit' | 'DeFi Collateral';
  assetClass: TokenizationCategory; // NEW
  targetRaiseAmount: number;
  description: string; // The "Soul" of the project
  website?: string;
}

// --- JURISDICTION & ENTITY ---

export interface EntityDetails {
  companyName: string;
  isNameAvailable?: boolean;
  registrationState?: string; // e.g. Delaware, Wyoming, Milan, London
  directors: string[]; // List of names
  shareholders: string[]; // List of names
  shareCapital: number;
  registeredAddress: string;
  
  // New Granular Fields
  formationAgent?: string; // "Registered Agent" (US) or "Notaio" (IT)
  taxId?: string; // EIN, VAT, etc.
  fiscalYearEnd?: string;
  governanceType?: 'Member-Managed' | 'Manager-Managed' | 'Board';
}

export interface JurisdictionData {
  country: string;
  region: string;
  spvType: string;
  regulatoryRegime: string;
  entityDetails: EntityDetails;
}

// --- ASSET & FINANCIALS ---

export interface AssetFinancials {
  // Real Estate
  noi?: number; // Net Operating Income
  occupancyRate?: number;
  capRate?: number;
  
  // Business
  ebitda?: number;
  revenue?: number;
  burnRate?: number;
  cashOnHand?: number;
  
  // General
  existingDebt?: number;
  lastAppraisalDate?: string;
  appraisalValue: number;
}

export interface AssetData {
  category: TokenizationCategory;
  assetName: string;
  description?: string;
  
  // Specifics
  assetType?: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  industry?: string;
  artistName?: string;
  medium?: string;
  
  // Location/Specs
  address?: string;
  sqft?: number;
  yearFounded?: number;
  yearCreated?: number;
  
  valuation: number;
  currency: string;
  financials: AssetFinancials;

  // Media & Docs
  images: string[]; // Array of URLs
  businessPlanUrl?: string; // External Link
  generatedBusinessPlan?: string; // AI Generated Text
}

// --- COMPLIANCE ---

export interface ComplianceData {
  kycProvider: string;
  accreditationRequired: boolean;
  amlCheckEnabled: boolean;
  jurisdictionRestrictions: string[]; // ["KP", "IR", "SY"] etc.
  
  // Specifics
  regFramework: 'Reg D' | 'Reg S' | 'Reg A+' | 'MiCA' | 'None';
  retentionPolicy: string; // "5 Years", "Forever"
  whitelistingMode: 'Pre-Trade' | 'Post-Trade';
}

// --- TOKENOMICS ---

export interface TokenAllocation {
  founders: number; // %
  investors: number; // %
  treasury: number; // %
  advisors: number; // %
}

export interface TokenomicsData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  pricePerToken: number;
  hardCap: number;
  softCap: number;
  lockupPeriodMonths: number;
  
  // New
  vestingSchedule: string; // "4 Year linear"
  dividendPolicy: 'None' | 'Quarterly' | 'Annual';
  votingRights: boolean;
  allocation: TokenAllocation;
}

// --- DISTRIBUTION ---

export interface DistributionData {
  targetInvestorType: 'Retail' | 'Accredited' | 'Institutional' | 'Mixed';
  minInvestment: number;
  maxInvestment: number;
  marketingChannels: string[]; // ["Launchpad", "Direct", "Broker"]
  launchDate?: string;
}

// --- AI & ANALYSIS ---

export interface AiRiskReport {
  score: number; // 0-100
  level: 'Low' | 'Medium' | 'High';
  warnings: string[];
  opportunities: string[];
  legalRoadmap: string[];
}

// --- QUIZ & EDUCATION (NEW) ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
}

// Global State
export interface TokenizationState {
  projectInfo: ProjectInfo; // NEW
  jurisdiction: JurisdictionData;
  asset: AssetData;
  compliance: ComplianceData;
  tokenomics: TokenomicsData;
  distribution: DistributionData;
  
  // Analysis State
  riskReport?: AiRiskReport;
}

// Dashboard Types
export interface Project {
  id: string;
  title: string;
  category: TokenizationCategory;
  valuation: number;
  status: 'Draft' | 'Deploying' | 'Live' | 'Audit';
  progress: number;
  imageColor: string; // Keeping for fallback
  lastUpdated: string;
  
  // New Details for Marketplace/Investment View
  imageUrl?: string;
  description?: string;
  location?: string;
  apy?: string;
  minTicket?: number;
  targetRaise?: number;
  investorsCount?: number;
}

export type DashboardTab = 'OVERVIEW' | 'ASSETS' | 'WALLET' | 'DOCS' | 'SETTINGS';

export interface UserStats {
  totalValueLocked: number;
  activeProjects: number;
  totalInvestors: number;
  complianceScore: number;
}

// Step Props Interface
export interface StepProps {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: Partial<any>) => void;
  onValidationChange: (isValid: boolean) => void;
}
