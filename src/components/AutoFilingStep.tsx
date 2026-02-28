import React, { useState } from "react";
import { AgentActivityMonitor, LogEntry } from "./AgentActivityMonitor";
import { AutoFilingSimulation } from "./AutoFilingSimulation";
import { RealComplaintSubmission } from "./RealComplaintSubmission";

interface AutoFilingStepProps {
  wageData: any;
  messages: any[];
  violations: any[];
  complaintData?: any;
  onNext: () => void;
}

export function AutoFilingStep({
  wageData,
  messages,
  violations,
  complaintData,
  onNext,
}: AutoFilingStepProps) {
  const [autoFillLogs, setAutoFillLogs] = useState<LogEntry[]>([]);
  const isSimulationComplete =
    autoFillLogs.length > 0 &&
    autoFillLogs[autoFillLogs.length - 1].text.includes("🏁");

  // Derive workplace address from messages if possible, else empty string
  const workplaceAddress = "서울특별시 영등포구 양평로 21길 26"; // Hardcoded for demo, normally extracted from analysis
  const complainantName =
    complaintData?.complainantName ||
    messages?.find((m) => m.senderName !== "김부장")?.senderName ||
    "박현우";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1200px] mb-8 animate-in fade-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-navy mb-3">
            🖥️ 자동 접수 시뮬레이션
          </h2>
          <p className="text-gray-600">
            작성된 진정서 및 분석된 데이터를 바탕으로 고용노동부 민원포털에
            <br />
            진정서를 자동 접수하는 과정을 시뮬레이션합니다.
          </p>
        </div>
        <div className="w-full relative">
          <AgentActivityMonitor
            isComplete={isSimulationComplete}
            externalLogs={autoFillLogs.length > 0 ? autoFillLogs : undefined}
          />
          <div className="w-full max_w-[950px] mx-auto">
            <AutoFilingSimulation
              wageData={wageData}
              messages={messages}
              violations={violations}
              complaintData={complaintData}
              onLogsUpdate={setAutoFillLogs}
              onComplete={() => console.log("Auto fill simulation complete")}
              onNext={onNext}
            />
          </div>
        </div>

        {/* Phase 5: Real Complaint Submission appears after Simulation finishes */}
        {isSimulationComplete && (
          <RealComplaintSubmission
            complainantName={complainantName}
            workplaceAddress={workplaceAddress}
            onLogsUpdate={(newLogs) =>
              setAutoFillLogs((prev) => [...prev, ...newLogs])
            }
            onNext={onNext}
          />
        )}
      </div>
      <div className="h-20" /> {/* Spacer to avoid jumping */}
    </div>
  );
}
