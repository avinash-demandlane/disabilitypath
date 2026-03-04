import { useState, useEffect, useCallback } from "react";
import { FUNNEL_STEPS } from "@/config/funnel-steps";
import { addToDlContext, addMultipleToDlContext } from "@/lib/dl-context";
import { captureUrlParams } from "@/lib/url-params";
import { trackFunnelLoaded, trackPageViewed, trackLeadSubmitted, trackCustomEvent } from "@/lib/analytics";
import { postEmailProvided, postPhoneCaptured, postLead, postFunnelClosed } from "@/lib/webhooks";
import { allocateBuyer } from "@/lib/buyer-allocation";
import { checkDuplicate } from "@/lib/duplicate-check";
import ProgressBar from "@/components/ProgressBar";
import FunnelStep from "@/components/FunnelStep";
import PIIForm from "@/components/PIIForm";
import CTCOutcome from "@/components/CTCOutcome";
import DisqualifiedOutcome from "@/components/DisqualifiedOutcome";

type Phase = "questions" | "pii" | "processing" | "outcome";

export default function Funnel() {
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [, setDisqualCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Outcome state
  const [outcomeType, setOutcomeType] = useState<"ctc" | "dq">("ctc");
  const [ctcNumber, setCtcNumber] = useState("");
  const [qualStatus, setQualStatus] = useState("");
  const [qualified, setQualified] = useState(true);

  // Capture URL params + fire Funnel Loaded on mount
  useEffect(() => {
    const params = captureUrlParams();
    trackFunnelLoaded(params);
  }, []);

  // Track page views
  useEffect(() => {
    if (phase === "questions") {
      const step = FUNNEL_STEPS[stepIndex];
      if (step) trackPageViewed(step.id, stepIndex, FUNNEL_STEPS.length);
    } else if (phase === "pii") {
      trackPageViewed("pii_form", FUNNEL_STEPS.length, FUNNEL_STEPS.length + 1);
    }
  }, [stepIndex, phase]);

  // Fire funnel closed on page unload
  useEffect(() => {
    const handler = () => { postFunnelClosed(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const handleStepSelect = useCallback((value: string, disqualifies?: boolean) => {
    const step = FUNNEL_STEPS[stepIndex];
    addToDlContext(step.dlKey, value);
    trackCustomEvent("answer_selected", { step: step.id, value });

    if (disqualifies) {
      setDisqualCount((c) => c + 1);
    }

    if (stepIndex < FUNNEL_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // All questions answered → go to PII
      setPhase("pii");
    }
  }, [stepIndex]);

  const handlePIISubmit = useCallback(async (data: { firstName: string; lastName: string; email: string; phone: string }) => {
    setSubmitting(true);

    // Store PII
    addMultipleToDlContext({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });

    // Fire email webhook
    postEmailProvided();
    trackCustomEvent("email_provided", { email: data.email });

    // Fire phone webhook
    postPhoneCaptured();
    trackCustomEvent("phone_captured", { phone: data.phone });

    // Check duplicate
    const { exists } = await checkDuplicate(data.phone);
    if (exists) {
      addToDlContext("is_duplicate", "true");
    }

    setPhase("processing");

    // Buyer allocation
    const result = await allocateBuyer();
    setQualified(result.qualified);
    setQualStatus(result.qualStatus);

    if (result.client) {
      if (result.client.type === "ctc" && result.client.ctcNumber) {
        setCtcNumber(result.client.ctcNumber);
        setOutcomeType("ctc");
      } else {
        setOutcomeType("dq");
      }
    } else {
      setOutcomeType("dq");
    }

    // Post the lead
    await postLead();
    trackLeadSubmitted(
      result.client?.leadGrade || "z",
      result.client?.id || "none"
    );

    addToDlContext("ps_converted", "true");
    setSubmitting(false);
    setPhase("outcome");
  }, []);

  const totalSteps = FUNNEL_STEPS.length + 1; // questions + PII
  const currentStep = phase === "questions" ? stepIndex + 1 : FUNNEL_STEPS.length + 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg text-primary">DisabilityPath</span>
          <span className="text-xs text-text-muted">Free Evaluation</span>
        </div>
      </header>

      {/* Progress */}
      {phase !== "outcome" && (
        <div className="bg-white border-b border-border px-4 py-3">
          <div className="max-w-xl mx-auto">
            <ProgressBar current={currentStep} total={totalSteps} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-xl mx-auto">
          {phase === "questions" && (
            <FunnelStep
              key={FUNNEL_STEPS[stepIndex].id}
              step={FUNNEL_STEPS[stepIndex]}
              onSelect={handleStepSelect}
            />
          )}

          {phase === "pii" && (
            <PIIForm onSubmit={handlePIISubmit} submitting={submitting} />
          )}

          {phase === "processing" && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
              <p className="text-text-muted text-lg">Checking your eligibility…</p>
            </div>
          )}

          {phase === "outcome" && outcomeType === "ctc" && (
            <CTCOutcome phoneNumber={ctcNumber} qualified={qualified} />
          )}

          {phase === "outcome" && outcomeType === "dq" && (
            <DisqualifiedOutcome qualStatus={qualStatus} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border px-4 py-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-text-muted text-xs">
            This is a free eligibility check. Results are not guaranteed.
            {" "}
            <a href="/privacy" className="underline">Privacy Policy</a>
            {" · "}
            <a href="/terms" className="underline">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
