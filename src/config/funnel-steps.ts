export interface FunnelOption {
  label: string;
  value: string;
  disqualifies?: boolean;
}

export interface FunnelStep {
  id: string;
  dlKey: string;
  question: string;
  subtext?: string;
  options: FunnelOption[];
  type: "single" | "multi";
}

export const FUNNEL_STEPS: FunnelStep[] = [
  {
    id: "receiving_ben",
    dlKey: "PPR_receiving_ben",
    question: "Are you currently receiving any disability benefits?",
    options: [
      { label: "Social Security Disability (SSD) Benefits", value: "Social Security Disability (SSD) Benefits" },
      { label: "Supplemental Security Income (SSI)", value: "Supplemental Security Income (SSI)" },
      { label: "Neither — I haven't applied yet", value: "Neither" },
    ],
    type: "single",
  },
  {
    id: "work_hours",
    dlKey: "PPR_question_6kdqgg",
    question: "How many hours per week are you currently working?",
    options: [
      { label: "I'm not currently working", value: "Not working" },
      { label: "20 hours or less per week", value: "20 hours or less per week" },
      { label: "More than 20 hours per week", value: "More than 20 hours per week" },
    ],
    type: "single",
  },
  {
    id: "fiveyearwork",
    dlKey: "PPR_fiveyearwork",
    question: "How many years have you worked in the last 10 years?",
    options: [
      { label: "Less than 4 years", value: "Less than 4 years" },
      { label: "Between 4 and 6 years", value: "Between 4 and 6 years" },
      { label: "More than 6 years", value: "More than 6 years" },
    ],
    type: "single",
  },
  {
    id: "outofwork",
    dlKey: "PPR_outofwork",
    question: "Are you currently out of work due to a disability?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "single",
  },
  {
    id: "doctorvisit",
    dlKey: "PPR_doctorvisit",
    question: "Have you seen a doctor for your condition?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "single",
  },
  {
    id: "pendingApl",
    dlKey: "PPR_pendingApl",
    question: "Do you have a pending disability application?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "single",
  },
  {
    id: "atty",
    dlKey: "PPR_atty",
    question: "Do you currently have an attorney or representative for your disability case?",
    options: [
      { label: "Yes", value: "Yes", disqualifies: true },
      { label: "No", value: "No" },
    ],
    type: "single",
  },
  {
    id: "optin_gender",
    dlKey: "PPR_optin_gender",
    question: "What is your gender?",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Prefer not to say", value: "Prefer not to say" },
    ],
    type: "single",
  },
  {
    id: "optin_age",
    dlKey: "PPR_optin_age",
    question: "What is your age range?",
    options: [
      { label: "Under 30", value: "Under 30" },
      { label: "30-39", value: "30-39" },
      { label: "40-49", value: "40-49" },
      { label: "50-59", value: "50-59" },
      { label: "60+", value: "60+" },
    ],
    type: "single",
  },
  {
    id: "health_conditions",
    dlKey: "PPR_health_conditions",
    question: "What is your primary health condition?",
    subtext: "Select the condition that most affects your ability to work.",
    options: [
      { label: "Back / Spine Issues", value: "Back / Spine Issues" },
      { label: "Depression", value: "Depression" },
      { label: "Anxiety / PTSD", value: "Anxiety / PTSD" },
      { label: "Heart Condition", value: "Heart Condition" },
      { label: "Arthritis / Joint Pain", value: "Arthritis / Joint Pain" },
      { label: "Diabetes", value: "Diabetes" },
      { label: "Breathing / Lung Issues", value: "Breathing / Lung Issues" },
      { label: "Other", value: "Other" },
    ],
    type: "single",
  },
  {
    id: "lastworked",
    dlKey: "PPR_lastworked",
    question: "When did you last work?",
    options: [
      { label: "Within the last 3 months", value: "Within the last 3 months" },
      { label: "3-6 months ago", value: "3-6 months ago" },
      { label: "6-12 months ago", value: "6-12 months ago" },
      { label: "Over a year ago", value: "Over a year ago" },
    ],
    type: "single",
  },
  {
    id: "alc_abuse",
    dlKey: "PPR_alc_abuse",
    question: "Do you currently have any substance use issues?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "single",
  },
  {
    id: "assets_new",
    dlKey: "PPR_assets_new",
    question: "What is the approximate value of your total assets?",
    subtext: "Include savings, investments, and property (excluding your primary home).",
    options: [
      { label: "Less than $2,000", value: "Less than $2000" },
      { label: "$2,000 - $5,000", value: "$2000 - $5000" },
      { label: "More than $5,000", value: "More than $5000" },
    ],
    type: "single",
  },
  {
    id: "maritalStatus_new",
    dlKey: "PPR_maritalStatus_new",
    question: "What is your marital status?",
    options: [
      { label: "Single", value: "Single" },
      { label: "Married", value: "Married" },
      { label: "Divorced", value: "Divorced" },
      { label: "Widowed", value: "Widowed" },
    ],
    type: "single",
  },
  {
    id: "doctorVisit_new",
    dlKey: "PPR_doctorVisit_new",
    question: "When was your most recent doctor visit for your condition?",
    options: [
      { label: "Within last 12 months", value: "Within last 12 months" },
      { label: "1-2 years ago", value: "1-2 years ago" },
      { label: "More than 2 years ago", value: "More than 2 years ago" },
      { label: "I haven't seen a doctor", value: "Never" },
    ],
    type: "single",
  },
];
