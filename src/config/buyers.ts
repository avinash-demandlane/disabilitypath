/** Buyer configuration — replace with actual buyer data */
export interface BuyerConfig {
  id: string;
  name: string;
  type: "ctc" | "redirect";
  ctcNumber?: string;
  redirectUrl?: string;
  /** States this buyer accepts (abbreviations). Empty = all states */
  states: string[];
  /** Max leads per day */
  dailyCap: number;
  /** Minimum lead grade accepted (a=best, z=worst) */
  minGrade: string;
  /** Active hours (0-23) */
  activeHours: { start: number; end: number };
}

export const BUYERS: BuyerConfig[] = [
  {
    id: "buyer_default",
    name: "Default Disability Buyer",
    type: "ctc",
    ctcNumber: "YOUR_CTC_NUMBER",
    states: [],
    dailyCap: 100,
    minGrade: "f",
    activeHours: { start: 8, end: 20 },
  },
  {
    id: "buyer_dq",
    name: "DQ Handler",
    type: "ctc",
    ctcNumber: "YOUR_DQ_CTC_NUMBER",
    states: [],
    dailyCap: 500,
    minGrade: "z",
    activeHours: { start: 0, end: 23 },
  },
];
