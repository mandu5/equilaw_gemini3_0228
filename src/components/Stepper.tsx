export function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "증거 업로드" },
    { num: 2, label: "AI 분석" },
    { num: 3, label: "진정서 작성" },
    { num: 4, label: "자동접수" },
    { num: 5, label: "다음 단계" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isPast = currentStep > step.num;

          return (
            <div
              key={step.num}
              className="flex flex-col items-center relative flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors duration-300
                ${
                  isActive
                    ? "bg-navy text-white shadow-md ring-4 ring-navy/20"
                    : isPast
                      ? "bg-gold text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.num}
              </div>
              <span
                className={`mt-2 text-sm font-semibold transition-colors duration-300 ${isActive ? "text-navy" : isPast ? "text-gray-800" : "text-gray-400"}`}
              >
                {step.label}
              </span>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-[2px] -z-10
                  ${currentStep > step.num ? "bg-gold" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
