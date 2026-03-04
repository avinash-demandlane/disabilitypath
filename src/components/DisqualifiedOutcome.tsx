interface DisqualifiedOutcomeProps {
  qualStatus: string;
}

export default function DisqualifiedOutcome({ qualStatus }: DisqualifiedOutcomeProps) {
  const message = qualStatus === "atty-disqual"
    ? "Since you already have legal representation, we're unable to assist with your case at this time."
    : "Based on your answers, you may not currently qualify for the benefits we help with.";

  return (
    <div className="animate-fade-in-up text-center">
      <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
        Thank You for Your Time
      </h2>
      <p className="text-text-muted mb-6 max-w-md mx-auto">
        {message}
      </p>
      <p className="text-text-muted text-sm max-w-md mx-auto">
        If your situation changes, feel free to come back and check your eligibility again.
      </p>
    </div>
  );
}
