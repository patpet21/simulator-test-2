
import { ProjectInfo, TokenizationCategory } from '../types';

export const AUTOFILL_ASSET_GENERAL_PROMPT = (info: ProjectInfo, category: TokenizationCategory) => `
Act as a real estate and business analyst. 
Based strictly on the user's project description, extract or estimate the asset details.

User Project Info:
- Name: ${info.projectName}
- Goal: ${info.projectGoal}
- Description: ${info.description}
- Category: ${category}

Task: Populate the following fields. If the user didn't specify a value (e.g. sqft), ESTIMATE a realistic number based on the context (e.g., if "small apartment", guess 800 sqft).

Return strictly JSON:
{
  "assetName": "string (refined title)",
  "valuation": number (estimated value in USD),
  "assetType": "string (Residential, Commercial, etc - only if Real Estate)",
  "industry": "string (only if Business)",
  "sqft": number (only if Real Estate),
  "address": "string (City, Country inferred)",
  "description": "string (a professional 2-sentence summary)"
}
`;

export const AUTOFILL_ASSET_FINANCIALS_PROMPT = (info: ProjectInfo, category: TokenizationCategory, valuation: number) => `
Act as a financial underwriter.
Based on the project "${info.projectName}" (${category}) with an estimated valuation of $${valuation}.

Generate REALISTIC financial projections/current stats.

Return strictly JSON:
{
  "noi": number (Net Operating Income - for Real Estate),
  "revenue": number (for Business),
  "ebitda": number (for Business),
  "occupancyRate": number (0-100, for Real Estate),
  "existingDebt": number (conservative estimate)
}
`;
