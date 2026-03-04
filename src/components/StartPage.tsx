interface StartPageProps {
  onAnswer: (answer: "yes" | "no") => void;
}

export default function StartPage({ onAnswer }: StartPageProps) {
  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-5 pt-10 pb-8">
        {/* Statue of Liberty icon */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-6 shadow-md">
          <img
            src="/liberty-icon.png"
            alt="Statue of Liberty"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback: show emoji if image not found
              const target = e.currentTarget;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<span style="font-size:48px;display:flex;align-items:center;justify-content:center;height:100%">🗽</span>';
            }}
          />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1a1a1a] leading-tight mb-4">
          Over 50 and Unemployed?
        </h1>

        {/* Subtext */}
        <p className="text-center text-[#333] text-base sm:text-lg leading-relaxed mb-2 max-w-sm">
          You may be eligible for disability benefits up to{" "}
          <strong className="text-[#1a1a1a]">$4,018 every month</strong>.
        </p>

        <p className="text-center text-[#333] text-base mb-8">
          Answer below to see if you qualify.
        </p>

        {/* Question */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] mb-6">
          Are You 40 Years or Older?
        </h2>

        {/* YES / NO buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-12">
          {/* YES */}
          <button
            onClick={() => onAnswer("yes")}
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-[#2196F3] text-white shadow-lg hover:bg-[#1e88e5] active:scale-[0.96] transition-all"
          >
            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-xl font-bold tracking-wide">YES</span>
          </button>

          {/* NO */}
          <button
            onClick={() => onAnswer("no")}
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-[#bdbdbd] text-white shadow-lg hover:bg-[#a0a0a0] active:scale-[0.96] transition-all"
          >
            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-xl font-bold tracking-wide">NO</span>
          </button>
        </div>
      </main>

      {/* Disclaimer */}
      <div className="px-5 pb-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-[#888] leading-relaxed mb-3">
            <strong className="text-[#666]">Disclaimer</strong>
            <br />
            Disability Path is a private entity and is not affiliated with, endorsed by, or associated
            with the U.S. government or the Social Security Administration (SSA). We operate
            independently to connect individuals seeking Social Security Disability benefits with
            experienced law firms and advocates. Our role is solely that of a broker, facilitating
            these connections to assist claimants in navigating the disability benefits process.
            {" "}
            <strong className="text-[#666]">Important Notice:</strong> The information provided on
            this website is for general informational purposes only and should not be construed as
            legal advice. While we strive to ensure the accuracy and completeness of the content,
            we make no guarantees regarding its currentness or applicability to your specific situation.
            For precise and up-to-date information, we recommend consulting official government
            resources or contacting your local Social Security office.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#ddd] px-5 py-4 text-center">
        <a href="/terms" className="text-sm text-[#555] underline">Terms</a>
        <span className="text-sm text-[#999] mx-2">·</span>
        <a href="/privacy" className="text-sm text-[#555] underline">Privacy policy</a>
      </footer>

      {/* Bottom accent bar */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
    </div>
  );
}
