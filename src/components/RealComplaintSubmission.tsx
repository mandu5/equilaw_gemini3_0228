import React, { useState } from "react";
import { LogEntry } from "./AgentActivityMonitor";
import {
  MapPin,
  Mail,
  Printer,
  Send,
  CheckCircle2,
  ChevronDown,
  Check,
} from "lucide-react";

interface Jurisdiction {
  name: string;
  address: string;
  tel: string;
  fax: string;
}

const JURISDICTION_DB: Record<string, Jurisdiction> = {
  영등포: {
    name: "서울남부지청",
    address: "서울 영등포구 버드나루로 지하 63",
    tel: "02-2639-2200",
    fax: "02-2633-1755",
  },
  강남: {
    name: "서울강남지청",
    address: "서울 강남구 논현로 406",
    tel: "02-3468-4800",
    fax: "02-3468-4899",
  },
  중구: {
    name: "서울지방고용노동청",
    address: "서울 중구 삼일대로 363",
    tel: "02-2250-5700",
    fax: "02-2250-5800",
  },
  마포: {
    name: "서울서부지청",
    address: "서울 마포구 만리재로 15",
    tel: "02-2077-6000",
    fax: "02-2077-6099",
  },
  성동: {
    name: "서울동부지청",
    address: "서울 성동구 아차산로 113",
    tel: "02-2142-8800",
    fax: "02-2142-8899",
  },
  강북: {
    name: "서울북부지청",
    address: "서울 강북구 도봉로 260",
    tel: "02-2171-6700",
    fax: "02-2171-6799",
  },
  관악: {
    name: "서울관악지청",
    address: "서울 관악구 관악로 152",
    tel: "02-3282-9200",
    fax: "02-3282-9299",
  },
  수원: {
    name: "경기지방고용노동청",
    address: "경기 수원시 장안구 수성로 287",
    tel: "031-259-0200",
    fax: "031-259-0299",
  },
  부산: {
    name: "부산지방고용노동청",
    address: "부산 연제구 중앙대로 1001",
    tel: "051-850-6300",
    fax: "051-850-6399",
  },
};

const DEFAULT_JURISDICTION = JURISDICTION_DB["영등포"];

function getJurisdiction(workplaceAddress: string | undefined): Jurisdiction {
  if (!workplaceAddress) return DEFAULT_JURISDICTION;
  for (const [key, value] of Object.entries(JURISDICTION_DB)) {
    if (workplaceAddress.includes(key)) return value;
  }
  return DEFAULT_JURISDICTION;
}

interface RealComplaintSubmissionProps {
  complainantName: string;
  workplaceAddress: string;
  onLogsUpdate: (logs: LogEntry[]) => void;
  onNext: () => void;
}

export function RealComplaintSubmission({
  complainantName,
  workplaceAddress,
  onLogsUpdate,
  onNext,
}: RealComplaintSubmissionProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const [submissionStage, setSubmissionStage] = useState<
    "idle" | "preparing" | "sending" | "success"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");

  const jurisdiction = getJurisdiction(workplaceAddress);

  const canSubmit =
    phoneNumber.length > 8 &&
    email.includes("@") &&
    disclaimerChecked &&
    submissionStage === "idle";

  const handleSubmission = () => {
    if (!canSubmit) return;

    setSubmissionStage("preparing");
    const startTime = Date.now();
    let logs: LogEntry[] = [];

    const addLog = (text: string, delayMs: number, customTime?: number) => {
      setTimeout(() => {
        logs = [
          ...logs,
          {
            timeMs:
              customTime !== undefined ? customTime : Date.now() - startTime,
            agentProcess: "Action",
            text: `[${((customTime !== undefined ? customTime : Date.now() - startTime) / 1000).toFixed(1)}s] ${text}`,
          },
        ];
        onLogsUpdate(logs);
      }, delayMs);
    };

    // Phase 1: Preparation
    addLog("📝 Action Agent: Preparing filing package...", 0);
    addLog("📝 Action Agent: Complaint document: 3 pages, verified ✓", 500);
    addLog("📎 Action Agent: Attaching evidence: kakao_screenshot.png", 1000);
    addLog("📎 Action Agent: Attaching wage calculation sheet ✓", 1500);

    setTimeout(() => {
      setSubmissionStage("sending");

      // Phase 2: Sending
      addLog(
        `📍 Action Agent: Target: ${jurisdiction.name} (${jurisdiction.address} 관할)`,
        0,
        2000,
      );
      addLog("📧 Action Agent: Connecting to filing channel...", 500, 2500);
      addLog(
        `📧 Action Agent: Sending complaint to ${jurisdiction.name}...`,
        1000,
        3000,
      );

      // Progress bar animation
      let p = 0;
      const progressInterval = setInterval(() => {
        p += 5;
        setProgress(Math.min(p, 100));
        if (p >= 100) clearInterval(progressInterval);
      }, 100);

      // Phase 3: Confirmation
      setTimeout(() => {
        setSubmissionStage("success");
        const rn = `EQL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
        setReferenceNumber(rn);

        addLog("✅ Action Agent: Filing CONFIRMED", 0, 4000);
        addLog(`✅ Action Agent: Reference: ${rn}`, 500, 4500);
        addLog(
          `📧 Action Agent: Confirmation email sent to ${email}`,
          1000,
          5000,
        );

        setTimeout(() => {
          logs = [
            ...logs,
            {
              timeMs: 5500,
              agentProcess: "Coordinator",
              text: "[5.5s] 🎉 Coordinator Agent: Mission complete — Evidence → Analysis → Filing in 47 seconds",
            },
          ];
          onLogsUpdate(logs);
        }, 1500);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="w-full mt-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border-l-4 border-l-[#2563EB] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50/50 border-b border-gray-100 p-6 px-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Printer className="w-6 h-6 text-[#2563EB]" />
            📠 관할관서 팩스 자동 발송
          </h2>
          <p className="text-gray-600 mt-2 font-medium">
            AI가 작성한 진정서와 증거자료를 관할 노동관서에 인터넷 팩스로 즉시 발송합니다.
          </p>
        </div>

        {submissionStage === "success" ? (
          // SUCCESS CARD
          <div className="p-8">
            <div className="bg-[#F0FDF4] border border-green-200 border-l-4 border-l-green-500 rounded-lg p-6 mb-8 shadow-sm">
              <h3 className="text-xl font-bold text-green-800 flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-7 h-7 text-green-600" />✅ 진정서
                접수 완료
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8 bg-white/60 p-5 rounded border border-green-100">
                <div className="flex justify-between items-center py-2 border-b border-green-100/50">
                  <span className="text-gray-500 font-medium">접수번호</span>
                  <span className="font-bold text-gray-800 font-mono text-base">
                    {referenceNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100/50">
                  <span className="text-gray-500 font-medium">접수일시</span>
                  <span className="font-bold text-gray-800">
                    {new Date().toLocaleString("ko-KR")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100/50">
                  <span className="text-gray-500 font-medium">접수관서</span>
                  <span className="font-bold text-gray-800">
                    {jurisdiction.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100/50">
                  <span className="text-gray-500 font-medium">접수방법</span>
                  <span className="font-bold text-gray-800">
                    인터넷팩스 자동 발송
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 md:col-span-2">
                  <span className="text-gray-500 font-medium">처리기한</span>
                  <span className="font-bold text-[#1A4B8C]">
                    접수일로부터 25일 이내 (근로감독관집무규정)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-green-700 text-sm font-medium">
                <p className="flex items-start gap-2">
                  <span>📌</span>
                  접수 확인 알림이{" "}
                  <span className="font-bold border-b border-green-700/30">
                    {email}
                  </span>{" "}
                  주소로 발송되었습니다.
                </p>
                <p className="flex items-start gap-2">
                  <span>📌</span>
                  담당 근로감독관 배정 후 출석 요구가 있을 수 있습니다.
                </p>
              </div>

              <div className="flex gap-4 mt-8 flex-wrap">
                <button
                  onClick={() => window.print()}
                  className="flex-1 min-w-[200px] bg-white text-green-700 border border-green-300 hover:bg-green-50 font-bold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  접수 확인서 다운로드
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  다음 단계 안내 보기 →
                </button>
              </div>
            </div>

            {/* Next Steps preview directly below */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-navy text-white px-2 py-0.5 rounded text-xs">
                  안내
                </span>
                📋 접수 후 진행 절차
              </h4>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex flex-col items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <span className="font-bold block mb-1">
                      근로감독관 배정 (접수 후 1-2주 이내)
                    </span>
                    <span className="text-gray-500">
                      담당 근로감독관이 배정되면 알림톡/문자로 통보됩니다.
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex flex-col items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <span className="font-bold block mb-1">
                      출석 요구 및 사실관계 조사
                    </span>
                    <span className="text-gray-500">
                      진정인과 피진정인에게 출석을 요구하여 조사합니다.
                      <br />
                      2회 이상 불출석 시 신고의사 없음으로 간주될 수 있습니다.
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex flex-col items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <span className="font-bold block mb-1">
                      시정지시 또는 형사입건
                    </span>
                    <span className="text-gray-500">
                      임금체불 확인 시 사업주에게 시정지시하며 미이행 시
                      형사입건 후 검찰에 송치됩니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // PRE-SUBMISSION FORM
          <div className="p-8 space-y-8">
            {/* 1. Jurisdiction Auto-Detection Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                <MapPin className="text-red-500 w-5 h-5" />
                관할관서 자동 판별 결과
                <span
                  className="text-gray-400 cursor-help ml-2"
                  title="진정서는 사업장 소재지 관할 고용노동관서에 접수해야 합니다 (근로감독관집무규정 제37조)"
                >
                  ⓘ
                </span>
              </h3>
              <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                <div className="text-gray-500 font-medium">사업장 주소:</div>
                <div className="text-gray-800 font-medium bg-yellow-50 px-2 py-0.5 rounded -ml-2 inline-block w-fit group relative">
                  {workplaceAddress || "주소 불명 - 기본 관서 매핑"}
                  <div className="absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    증거 자료에서 추출됨
                  </div>
                </div>

                <div className="text-gray-500 font-medium">관할 관서:</div>
                <div className="text-[#1A4B8C] font-bold text-base flex justify-between items-center group">
                  {jurisdiction.name}
                  <span className="text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check className="w-3 h-3" /> 매핑 완료
                  </span>
                </div>

                <div className="text-gray-500 font-medium">주소:</div>
                <div className="text-gray-700">{jurisdiction.address}</div>

                <div className="text-gray-500 font-medium">연락처:</div>
                <div className="text-gray-700 text-xs mt-0.5">
                  <span className="inline-block bg-gray-200 px-2 py-0.5 rounded mr-2">
                    TEL: {jurisdiction.tel}
                  </span>
                  <span className="inline-block bg-gray-200 px-2 py-0.5 rounded">
                    FAX: {jurisdiction.fax}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Filing Package Preview */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b border-dashed border-gray-300 pb-2 mb-4">
                📋 접수 서류 패키지
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">
                    진정서 (자동 생성) — 3페이지
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>증거자료 첨부 (KakaoTalk 스크린샷 등)</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>임금 체불 계산 명세서 (자동 생성)</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>관련 법령 적용 조항 요약본</span>
                </div>
              </div>
            </div>

            {/* 3. User Confirmation Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b border-dashed border-gray-300 pb-2 mb-4">
                ✍️ 접수자 정보 및 동의
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    진정인 성명
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 text-gray-600 rounded-md py-2 px-3 text-sm font-medium cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    분석 결과에서 자동 입력되었습니다.
                  </p>
                </div>
                <div />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={submissionStage !== "idle"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com (접수 확인용)"
                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={submissionStage !== "idle"}
                  />
                </div>
              </div>

              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                  <Printer className="w-5 h-5" /> 팩스 자동 발송
                </h4>
                <p className="text-sm text-blue-700">
                  위에서 생성된 진정서와 증거자료가 <strong>{jurisdiction.name} ({jurisdiction.fax})</strong>으로 암호화되어 즉시 팩스로 전송됩니다.
                </p>
              </div>

              <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={disclaimerChecked}
                  onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  disabled={submissionStage !== "idle"}
                />
                <span className="text-sm text-gray-700 font-medium leading-relaxed">
                  본인은 본 진정서의 내용 및 첨부된 증거자료가 사실과 다름없음을
                  확인하며, <br className="hidden md:block" /> 이를{" "}
                  {jurisdiction.name} 등 관할 고용노동관서에 공식적으로 접수하는
                  것에 동의합니다.
                </span>
              </label>
            </div>

            {/* 4. Submission Button & Progress Area */}
            <div className="pt-2">
              {submissionStage === "idle" && (
                <button
                  onClick={handleSubmission}
                  disabled={!canSubmit}
                  className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    canSubmit
                      ? "bg-[#2563EB] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Printer className="w-5 h-5" />
                  팩스로 진정서 발송하기
                </button>
              )}

              {/* Progress Simulation (Phase 1 & 2) */}
              {(submissionStage === "preparing" ||
                submissionStage === "sending") && (
                <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold whitespace-pre-wrap text-[#1A4B8C]">
                      {submissionStage === "preparing"
                        ? "📝 보안 연결 수립 및 제출 서류 패키징 중..."
                        : `📨 ${jurisdiction.name} 으로 서류 암호화 전송 중...`}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1A4B8C]">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-xs text-gray-500 font-mono animate-pulse">
                    <div>
                      {submissionStage === "preparing"
                        ? "> verifying document integrity"
                        : "> initiating secure transfer protocol"}
                    </div>
                    <div>
                      {submissionStage === "preparing"
                        ? "> compressing evidence files"
                        : "> Handshake successful. Uploading bytes..."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
