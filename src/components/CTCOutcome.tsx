import { useEffect } from "react";
import { trackCTCEvent } from "@/lib/analytics";
import { postCTC } from "@/lib/webhooks";

interface CTCOutcomeProps {
  phoneNumber: string;
  qualified: boolean;
}

export default function CTCOutcome({ phoneNumber, qualified }: CTCOutcomeProps) {
  useEffect(() => {
    trackCTCEvent("displayed", phoneNumber);
    postCTC("displayed", phoneNumber);
  }, [phoneNumber]);

  function handleCall() {
    trackCTCEvent("clicked", phoneNumber);
    postCTC("clicked", phoneNumber);
    window.location.href = `tel:${phoneNumber.replace(/\D/g, "")}`;
  }

  return (
    <div className="animate-fade-in-up text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
        {qualified ? "Great News — You May Qualify!" : "We Can Still Help!"}
      </h2>
      <p className="text-text-muted mb-8 max-w-md mx-auto">
        {qualified
          ? "Based on your answers, you may be eligible for disability benefits up to $4,018/month. Call now to speak with a specialist."
          : "A specialist can review your situation and help you understand your options. Call now for a free consultation."}
      </p>

      <button
        onClick={handleCall}
        className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-success text-white font-bold text-xl hover:bg-success/90 transition-colors active:scale-[0.97] shadow-lg shadow-success/25"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call {phoneNumber}
      </button>

      <p className="text-text-muted text-sm mt-4">Free consultation. No obligation.</p>
    </div>
  );
}
