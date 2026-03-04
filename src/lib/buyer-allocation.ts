import { extractDlContext, addMultipleToDlContext } from "./dl-context";

export interface BuyerCandidate {
  id: string;
  name: string;
  type: "ctc" | "redirect";
  ctcNumber?: string;
  redirectUrl?: string;
  leadGrade: string;
}

export interface AllocationResult {
  qualified: boolean;
  client: BuyerCandidate | null;
  qualStatus: string;
}

/**
 * Grade leads a-z based on qualification answers.
 * 'a' = highest quality, 'z' = lowest / disqualified.
 */
export function gradeLead(): { grade: string; disqualCount: number; qualStatus: string } {
  const ctx = extractDlContext();
  let disqualCount = 0;
  let qualStatus = "qualified";

  // Disqualifiers
  if (ctx.PPR_atty === "Yes") {
    disqualCount++;
    qualStatus = "atty-disqual";
  }

  // Scoring factors
  let score = 100;

  // Has pending application = good
  if (ctx.PPR_pendingApl === "Yes") score += 20;

  // Doctor visits = good
  if (ctx.PPR_doctorvisit === "Yes") score += 15;
  if (ctx.PPR_doctorVisit_new === "Within last 12 months") score += 10;

  // Out of work = good for disability
  if (ctx.PPR_outofwork === "Yes") score += 15;

  // Work history
  if (ctx.PPR_fiveyearwork === "Between 4 and 6 years") score += 10;
  else if (ctx.PPR_fiveyearwork === "More than 6 years") score += 15;

  // Assets check
  if (ctx.PPR_assets_new === "Less than $2000") score += 5;

  // Substance use is a negative
  if (ctx.PPR_alc_abuse === "Yes") score -= 20;

  // Convert score to grade a-z
  const grade = disqualCount > 0
    ? "z"
    : score >= 150 ? "a"
    : score >= 130 ? "b"
    : score >= 110 ? "c"
    : score >= 90 ? "d"
    : score >= 70 ? "e"
    : "f";

  return { grade, disqualCount, qualStatus };
}

/**
 * Allocate a buyer via the allocation API or fallback to local matching.
 */
export async function allocateBuyer(): Promise<AllocationResult> {
  const ctx = extractDlContext();
  const { grade, disqualCount, qualStatus } = gradeLead();

  // Store scoring in dl_context
  addMultipleToDlContext({
    number_of_disqual: String(disqualCount),
    "qual-status": qualStatus,
    user_qualified: disqualCount === 0 ? "true" : "false",
  });

  // Try the allocation API
  const apiUrl = import.meta.env.VITE_BUYER_ALLOCATION_URL;
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadLabel: `disability_${ctx.state || "unknown"}`,
          leadGrade: grade,
          qualStatus,
          state: ctx.state || ctx.ps_state || "",
          age: ctx.PPR_optin_age || "",
          conditions: ctx.PPR_health_conditions || "",
          counter: Date.now(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.candidates?.length > 0) {
          const selected = data.candidates[0];
          const client: BuyerCandidate = {
            id: selected.id || selected.clientId,
            name: selected.name || selected.clientName,
            type: selected.type || "ctc",
            ctcNumber: selected.ctcNumber || selected.phone,
            redirectUrl: selected.redirectUrl,
            leadGrade: grade,
          };
          saveSelectedClient(client);
          return { qualified: true, client, qualStatus };
        }
      }
    } catch (err) {
      console.warn("[buyer-allocation] API failed:", err);
    }
  }

  // Fallback: DQ leads get a default DQ client
  if (disqualCount > 0) {
    const dqClient: BuyerCandidate = {
      id: "disabilitypathDQ",
      name: "DisabilityPath DQ",
      type: "ctc",
      ctcNumber: "YOUR_DQ_CTC_NUMBER",
      leadGrade: "z",
    };
    saveSelectedClient(dqClient);
    return { qualified: false, client: dqClient, qualStatus };
  }

  // Fallback: qualified leads get default client
  const defaultClient: BuyerCandidate = {
    id: "disabilitypathDefault",
    name: "DisabilityPath Default",
    type: "ctc",
    ctcNumber: "YOUR_DEFAULT_CTC_NUMBER",
    leadGrade: grade,
  };
  saveSelectedClient(defaultClient);
  return { qualified: true, client: defaultClient, qualStatus };
}

function saveSelectedClient(client: BuyerCandidate) {
  addMultipleToDlContext({
    selected_client: client.id,
    selected_client_type: client.type,
    selected_client_lead_grade: client.leadGrade,
    selected_outcome: client.type === "ctc" ? "CTC" : "REDIRECT",
    ...(client.ctcNumber ? { ctc_number: client.ctcNumber } : {}),
    ...(client.redirectUrl ? { redirect_url: client.redirectUrl } : {}),
  });
}
