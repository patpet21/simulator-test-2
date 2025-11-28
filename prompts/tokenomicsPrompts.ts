
import { AssetData, ProjectInfo, JurisdictionData } from '../types';

export const GENERATE_TOKENOMICS_PROMPT = (
  asset: AssetData, 
  project: ProjectInfo,
  jurisdiction: JurisdictionData
) => `
Act as a Chief Financial Officer (CFO) and Token Engineer for a regulated Security Token Offering (STO).

--- CONTEXT ---
Project: ${project.projectName} (${project.projectGoal})
Asset Category: ${asset.category}
Valuation: $${asset.valuation}
Jurisdiction: ${jurisdiction.country} (${jurisdiction.spvType})

--- TASK ---
Design the optimal Tokenomics Structure.
1. Token Name/Symbol: Professional and catchy.
2. Supply & Price: Calculate a realistic Total Supply and Price per Token based on the Valuation ($${asset.valuation}). 
   *Rule: For Real Estate, keep price around $50-$1000/token. For Business, $1-$10.*
3. Allocation: Suggest a Cap Table split (Founders, Investors, Treasury, Advisors).
4. Vesting: Suggest a vesting schedule compliant with ${jurisdiction.country} norms.

--- OUTPUT FORMAT ---
Return strictly JSON:
{
  "tokenName": "string",
  "tokenSymbol": "string",
  "totalSupply": number,
  "pricePerToken": number,
  "allocation": {
    "founders": number (%),
    "investors": number (%),
    "treasury": number (%),
    "advisors": number (%)
  },
  "vestingSchedule": "string (e.g., '12m Cliff, 4y Linear')",
  "educationalNote": "string (A short expert tip explaining WHY this structure was chosen)"
}
`;
