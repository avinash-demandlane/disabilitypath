import type { FunnelStep as FunnelStepType } from "@/config/funnel-steps";

interface FunnelStepProps {
  step: FunnelStepType;
  onSelect: (value: string, disqualifies?: boolean) => void;
}

export default function FunnelStep({ step, onSelect }: FunnelStepProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold text-text leading-snug mb-2">
        {step.question}
      </h2>
      {step.subtext && (
        <p className="text-text-muted text-sm mb-6">{step.subtext}</p>
      )}
      {!step.subtext && <div className="mb-6" />}

      <div className="flex flex-col gap-3">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value, opt.disqualifies)}
            className="w-full text-left px-5 py-4 rounded-xl border-2 border-border bg-white hover:border-primary hover:bg-primary/5 transition-all duration-150 text-base font-medium text-text active:scale-[0.98]"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
