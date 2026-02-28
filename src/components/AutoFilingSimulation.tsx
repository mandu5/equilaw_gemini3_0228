"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ShieldCheck, FileText, Send, Copy, MapPin } from "lucide-react";
import { LogEntry } from "./AgentActivityMonitor";

interface FormType {
  formCode: string;
  formTitle: string;
  formTitleShort: string;
  portalUrl: string;
}

function detectFormType(violations: any[]): FormType {
  const allText = violations
    .map((v) => `${v.name || ""} ${v.lawArticle || ""} ${v.description || ""}`)
    .join(" ");

  if (/성희롱|sexual harassment/.test(allText)) {
    return {
      formCode: "SN003",
      formTitle: "직장 내 성희롱 신고서",
      formTitleShort: "성희롱 신고",
      portalUrl:
        "https://labor.moel.go.kr/minwonApply/minwonApply.do?searchGubun=2",
    };
  }
  if (/출산|육아|모성|maternity/.test(allText)) {
    return {
      formCode: "SN002",
      formTitle: "출산휴가·육아휴직 진정신고서",
      formTitleShort: "모성보호 진정",
      portalUrl:
        "https://labor.moel.go.kr/minwonApply/minwonApply.do?searchGubun=2",
    };
  }
  if (/청원|산업재해|안전|사망|사고/.test(allText)) {
    return {
      formCode: "SN004",
      formTitle: "근로감독 청원서",
      formTitleShort: "근로감독 청원",
      portalUrl:
        "https://labor.moel.go.kr/minwonApply/minwonApply.do?searchGubun=2",
    };
  }
  return {
    formCode: "SN001",
    formTitle: "진정서 (임금체불·직장내 괴롭힘·기타 노동법 위반)",
    formTitleShort: "임금체불 진정",
    portalUrl:
      "https://labor.moel.go.kr/minwonApply/minwonApply.do?searchGubun=2",
  };
}

interface JurisdictionOffice {
  name: string;
  address: string;
  tel: string;
}

const JURISDICTION_MAP: Record<string, JurisdictionOffice> = {
  중구: {
    name: "서울지방고용노동청",
    address: "서울 중구 삼일대로 363",
    tel: "02-2250-5700",
  },
  종로: {
    name: "서울지방고용노동청",
    address: "서울 중구 삼일대로 363",
    tel: "02-2250-5700",
  },
  용산: {
    name: "서울지방고용노동청",
    address: "서울 중구 삼일대로 363",
    tel: "02-2250-5700",
  },
  강남: {
    name: "서울강남지청",
    address: "서울 강남구 논현로 406",
    tel: "02-3468-4800",
  },
  서초: {
    name: "서울강남지청",
    address: "서울 강남구 논현로 406",
    tel: "02-3468-4800",
  },
  송파: {
    name: "서울강남지청",
    address: "서울 강남구 논현로 406",
    tel: "02-3468-4800",
  },
  강동: {
    name: "서울강남지청",
    address: "서울 강남구 논현로 406",
    tel: "02-3468-4800",
  },
  영등포: {
    name: "서울남부지청",
    address: "서울 영등포구 버드나루로 지하 63",
    tel: "02-2639-2200",
  },
  구로: {
    name: "서울남부지청",
    address: "서울 영등포구 버드나루로 지하 63",
    tel: "02-2639-2200",
  },
  금천: {
    name: "서울남부지청",
    address: "서울 영등포구 버드나루로 지하 63",
    tel: "02-2639-2200",
  },
  양천: {
    name: "서울남부지청",
    address: "서울 영등포구 버드나루로 지하 63",
    tel: "02-2639-2200",
  },
  마포: {
    name: "서울서부지청",
    address: "서울 마포구 만리재로 15",
    tel: "02-2077-6000",
  },
  서대문: {
    name: "서울서부지청",
    address: "서울 마포구 만리재로 15",
    tel: "02-2077-6000",
  },
  은평: {
    name: "서울서부지청",
    address: "서울 마포구 만리재로 15",
    tel: "02-2077-6000",
  },
  성동: {
    name: "서울동부지청",
    address: "서울 성동구 아차산로 113",
    tel: "02-2142-8800",
  },
  광진: {
    name: "서울동부지청",
    address: "서울 성동구 아차산로 113",
    tel: "02-2142-8800",
  },
  동대문: {
    name: "서울동부지청",
    address: "서울 성동구 아차산로 113",
    tel: "02-2142-8800",
  },
  중랑: {
    name: "서울동부지청",
    address: "서울 성동구 아차산로 113",
    tel: "02-2142-8800",
  },
  강북: {
    name: "서울북부지청",
    address: "서울 강북구 도봉로 260",
    tel: "02-2171-6700",
  },
  도봉: {
    name: "서울북부지청",
    address: "서울 강북구 도봉로 260",
    tel: "02-2171-6700",
  },
  노원: {
    name: "서울북부지청",
    address: "서울 강북구 도봉로 260",
    tel: "02-2171-6700",
  },
  성북: {
    name: "서울북부지청",
    address: "서울 강북구 도봉로 260",
    tel: "02-2171-6700",
  },
  관악: {
    name: "서울관악지청",
    address: "서울 관악구 관악로 152",
    tel: "02-3282-9200",
  },
  동작: {
    name: "서울관악지청",
    address: "서울 관악구 관악로 152",
    tel: "02-3282-9200",
  },
};

function detectJurisdiction(companyAddress: string): JurisdictionOffice {
  for (const [district, office] of Object.entries(JURISDICTION_MAP)) {
    if (companyAddress.includes(district)) return office;
  }
  return {
    name: "서울지방고용노동청",
    address: "서울 중구 삼일대로 363",
    tel: "02-2250-5700",
  };
}

interface AutoFilingSimulationProps {
  wageData: any;
  messages: any[];
  violations: any[];
  complaintData?: any;
  onLogsUpdate: (logs: LogEntry[]) => void;
  onComplete: () => void;
  onNext?: () => void;
}

interface FieldStatus {
  id: string;
  label: string;
  value: string;
  filledValue: string;
  isFilled: boolean;
  isActive: boolean;
}

export function AutoFilingSimulation({
  wageData,
  messages,
  violations,
  complaintData,
  onLogsUpdate,
  onComplete,
  onNext,
}: AutoFilingSimulationProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase 6 Real Portal States
  const [showGuide, setShowGuide] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract representative data from evidence (simple heuristics for demo)
  const complainantName = complaintData?.complainantName || "박현우";
  const respondentName = complaintData?.companyName || "한솔제조";
  const companyAddress =
    complaintData?.companyAddress || "경기도 성남시 분당구 판교역로 456";

  const formType = detectFormType(violations);
  const jurisdiction = detectJurisdiction(companyAddress);

  const initLogsFired = useRef(false);
  useEffect(() => {
    if (initLogsFired.current) return;
    initLogsFired.current = true;

    const currentLogTime = Date.now();
    const initLogs: LogEntry[] = [
      {
        timeMs: currentLogTime,
        agentProcess: "Action",
        text: `[0.0s] 🔍 Action Agent: Extracting workplace address from evidence...`,
      },
      {
        timeMs: currentLogTime + 100,
        agentProcess: "Action",
        text: `[0.1s] 📍 Action Agent: 사업장 소재지: ${companyAddress}`,
      },
      {
        timeMs: currentLogTime + 200,
        agentProcess: "Action",
        text: `[0.2s] 📍 Action Agent: Jurisdiction lookup: ${jurisdiction.name}`,
      },
      {
        timeMs: currentLogTime + 300,
        agentProcess: "Action",
        text: `[0.3s] ✅ Action Agent: Jurisdiction confirmed — ${jurisdiction.name} (${jurisdiction.tel})`,
      },
      {
        timeMs: currentLogTime + 400,
        agentProcess: "Action",
        text: `[0.4s] 📋 Action Agent: Analyzing violation types for form classification...`,
      },
      {
        timeMs: currentLogTime + 500,
        agentProcess: "Action",
        text: `[0.5s] 📋 Action Agent: Detected form type: ${formType.formTitle} (${formType.formCode})`,
      },
    ];
    setLogs(initLogs);
    onLogsUpdate(initLogs);
  }, [
    companyAddress,
    jurisdiction.name,
    jurisdiction.tel,
    formType.formTitle,
    formType.formCode,
    onLogsUpdate,
  ]);

  const toggleStep = (step: number) => {
    const newSteps = completedSteps.includes(step)
      ? completedSteps.filter((s) => s !== step)
      : [...completedSteps, step];
    setCompletedSteps(newSteps);

    if (newSteps.length === 4) {
      onLogsUpdate([
        {
          timeMs: Date.now(),
          agentProcess: "Coordinator",
          text: `[${((Date.now() - logs[0]?.timeMs || 0) / 1000).toFixed(1)}s] 🎉 Coordinator Agent: Real filing completed via 노동포털!`,
        },
        {
          timeMs: Date.now() + 100,
          agentProcess: "Coordinator",
          text: `[${((Date.now() - logs[0]?.timeMs || 0) / 1000).toFixed(1)}s] 🎉 Coordinator Agent: Mission complete — Evidence → Analysis → Filing`,
        },
      ]);
    }
  };

  const copyToClipboard = async (text: string, fieldName?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (fieldName) {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 1500);
      } else {
        setToastMessage("✅ 전체 데이터가 클립보드에 복사되었습니다!");
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err) {
      alert("클립보드 복사에 실패했습니다. 권한을 확인해주세요.");
    }
  };

  const handleFullCopyAndOpenPortal = () => {
    const fullText = `═══ EquiLaw 자동 생성 진정서 ═══\n서식: ${formType.formTitle} (${formType.formCode})\n관할관서: ${jurisdiction.name}\n생성일시: ${new Date().toLocaleString()}\n\n[진정인 정보]\n성명: ${complainantName}\n연락처: 010-1234-5678\n주소: 서울특별시 강남구 테헤란로 123\n\n[피진정인 정보]\n상호/사업장명: ${respondentName}\n대표자명: 김부장\n사업장 주소: ${companyAddress}\n전화번호: 031-987-6543\n\n[진정내용]\n체불임금 총액: \₩${wageData?.calculatedAmount ? wageData.calculatedAmount.toLocaleString() : "861,244"}\n체불 기간: ${wageData?.periodStart && wageData?.periodEnd ? `${wageData.periodStart} ~ ${wageData.periodEnd}` : "2024.11.01 ~ 2024.12.31"}\n\n[진정 사유]\n${reasonText}\n\n═══════════════════════════════\n이 데이터는 EquiLaw AI가 자동 생성하였습니다.\n노동포털(labor.moel.go.kr)에서 해당 서식에 붙여넣기 하세요.`;

    copyToClipboard(fullText);

    onLogsUpdate([
      {
        timeMs: Date.now(),
        agentProcess: "Action",
        text: `[${((Date.now() - logs[0]?.timeMs || 0) / 1000).toFixed(1)}s] 📋 Action Agent: Filing data copied to clipboard ✓`,
      },
      {
        timeMs: Date.now() + 100,
        agentProcess: "Action",
        text: `[${((Date.now() - logs[0]?.timeMs || 0) / 1000).toFixed(1)}s] 🌐 Action Agent: Opening 고용노동부 노동포털...`,
      },
      {
        timeMs: Date.now() + 200,
        agentProcess: "Action",
        text: `[${((Date.now() - logs[0]?.timeMs || 0) / 1000).toFixed(1)}s] 📋 Action Agent: Step-by-step filing guide displayed`,
      },
    ]);

    window.open(formType.portalUrl, "_blank");
    setShowGuide(true);
  };

  // Format the violation summary for the "Reason" field
  const violationSummary = violations
    .map((v) => `${v.name} (${v.lawArticle})`)
    .join(", ");
  const reasonText = `본인은 상기 사업장에서 근로하였으나, 다음과 같은 법 위반 사실이 있어 진정합니다.\n\n적발된 위반사항:\n${violationSummary}\n\n체불임금 내역:\n기본급: ${wageData?.baseSalary ? wageData.baseSalary.toLocaleString() + "원" : "알 수 없음"}\n연장근로시간: ${wageData?.overtimeHours ? wageData.overtimeHours + "시간" : "해당 없음"}\n\n첨부된 카카오톡 대화 내용 및 증거 자료를 확인해 주시기 바랍니다.`;

  const initialFields: FieldStatus[] = [
    {
      id: "c_name",
      label: "성명",
      value: complainantName,
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "c_phone",
      label: "연락처",
      value: "010-1234-5678",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "c_addr",
      label: "주소",
      value: "서울특별시 강남구 테헤란로 123",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "r_company",
      label: "상호/사업장명",
      value: respondentName,
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "r_rep",
      label: "대표자명",
      value: "김부장",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "r_addr",
      label: "사업장 주소",
      value: "경기도 성남시 분당구 판교역로 456",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "r_phone",
      label: "사업장 전화번호",
      value: "031-987-6543",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "d_amount",
      label: "체불임금 총액",
      value: `₩${wageData?.calculatedAmount ? wageData.calculatedAmount.toLocaleString() : "861,244"}`,
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "d_period",
      label: "체불 기간",
      value:
        wageData?.periodStart && wageData?.periodEnd
          ? `${wageData.periodStart} ~ ${wageData.periodEnd}`
          : "2024.11.01 ~ 2024.12.31",
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
    {
      id: "d_reason",
      label: "진정 사유",
      value: reasonText,
      filledValue: "",
      isFilled: false,
      isActive: false,
    },
  ];

  const [fields, setFields] = useState<FieldStatus[]>(initialFields);

  const startSimulation = () => {
    setHasStarted(true);
    let currentLogTime = Date.now();

    // Initial Log
    const newLogs: LogEntry[] = [
      {
        timeMs: currentLogTime,
        agentProcess: "Action",
        text: `[${((Date.now() - currentLogTime) / 1000).toFixed(1)}s] 🖥️ Action Agent: Navigating to 고용노동부 진정서 양식...`,
      },
    ];
    setLogs(newLogs);
    onLogsUpdate(newLogs);

    // Sequence generator
    const simulateTyping = async () => {
      // Small pause before starting
      await new Promise((r) => setTimeout(r, 1000));

      for (let i = 0; i < initialFields.length; i++) {
        const field = initialFields[i];

        // Log starting to fill field
        currentLogTime = Date.now();
        const startFillLog: LogEntry = {
          timeMs: currentLogTime,
          agentProcess: "Action",
          text: `[${((Date.now() - newLogs[0].timeMs) / 1000).toFixed(1)}s] 🖥️ Action Agent: Filling ${field.label}...`,
        };
        newLogs.push(startFillLog);
        setLogs([...newLogs]);
        onLogsUpdate([...newLogs]);

        // Set active
        setFields((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, isActive: true } : f)),
        );

        // Scroll to active field smoothly
        if (containerRef.current) {
          const activeEl = containerRef.current.querySelector(
            `#field-${field.id}`,
          );
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }

        // Type out the value
        let currentText = "";
        for (const char of field.value) {
          currentText += char;
          setFields((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, filledValue: currentText } : f,
            ),
          );
          await new Promise((r) => setTimeout(r, 10)); // 10ms per char typing speed (FASTER)
        }

        // Mark as filled
        setFields((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, isFilled: true, isActive: false } : f,
          ),
        );

        // Log finished field
        currentLogTime = Date.now();
        const endFillLog: LogEntry = {
          timeMs: currentLogTime,
          agentProcess: "Action",
          text: `[${((Date.now() - newLogs[0].timeMs) / 1000).toFixed(1)}s] ✅ Action Agent: Completed ${field.label}: ${field.value.substring(0, 15)}${field.value.length > 15 ? "..." : ""}`,
        };
        newLogs.push(endFillLog);
        setLogs([...newLogs]);
        onLogsUpdate([...newLogs]);

        // Pause before next field
        await new Promise((r) => setTimeout(r, 200)); // FASTER
      }

      // Finish Sequence
      setIsFinished(true);
      currentLogTime = Date.now();
      const finalLog: LogEntry = {
        timeMs: currentLogTime,
        agentProcess: "Action",
        text: `[${((Date.now() - newLogs[0].timeMs) / 1000).toFixed(1)}s] 🏁 Action Agent: Form auto-fill complete. Awaiting user review.`,
      };
      newLogs.push(finalLog);
      setLogs([...newLogs]);
      onLogsUpdate([...newLogs]);
      onComplete();
    };

    simulateTyping();
  };

  const FieldRow = ({ field }: { field: FieldStatus }) => (
    <div
      id={`field-${field.id}`}
      className={`flex border-b border-gray-200 transition-colors duration-300 ${field.isActive ? "bg-blue-50/50" : "bg-white"}`}
    >
      <div className="w-1/3 md:w-1/4 bg-[#F5F5F5] p-3 md:p-4 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center justify-between">
        <span>{field.label}</span>
        {isFinished && (
          <button
            onClick={() => copyToClipboard(field.value, field.id)}
            className="text-gray-400 hover:text-blue-500 transition-colors relative flex shrink-0 ml-2"
            title="복사하기"
          >
            <Copy className="w-4 h-4" />
            {copiedField === field.id && (
              <span className="absolute -top-6 -right-5 text-xs text-green-500 font-bold break-keep w-max bg-white px-1 py-0.5 rounded shadow-sm border border-green-100 z-10">
                복사됨!
              </span>
            )}
          </button>
        )}
      </div>
      <div className="w-2/3 md:w-3/4 p-3 md:p-4 relative flex items-center">
        {field.id === "d_reason" ? (
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-0 resize-none text-sm text-gray-800"
            value={field.filledValue}
            readOnly
          />
        ) : (
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-0 text-sm text-gray-800"
            value={field.filledValue}
            readOnly
          />
        )}

        {/* Blinking Cursor for active field */}
        {field.isActive && (
          <div
            className="absolute w-0.5 h-5 bg-blue-500 animate-[pulse_0.75s_infinite] ml-2"
            style={{
              left:
                field.id === "d_reason"
                  ? "1rem"
                  : `calc(1rem + ${field.filledValue.length * 0.6}em)`,
              top: field.id === "d_reason" ? "1.5rem" : "auto",
            }}
          />
        )}

        {/* Checkmark for filled field */}
        {field.isFilled && (
          <div className="absolute right-6 text-green-500 animate-[fadeIn_0.3s_ease-out]">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-800 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <Check className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-[900px]">
        {/* Start Button Overlay */}
        {!hasStarted && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center">
              <ShieldCheck className="w-16 h-16 text-navy mb-4" />
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                원클릭 자동 접수
              </h4>
              <p className="text-gray-500 mb-8 max-w-md">
                EquiLaw의 Action Agent가 고용노동부 노동포털에 접속하여 추출된
                증거와 분석 결과를 바탕으로 진정서를 자동 작성합니다.
              </p>
              <button
                onClick={startSimulation}
                className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-3 text-lg"
              >
                <span className="text-2xl">🤖</span> AI 자동입력 시작
              </button>
            </div>
          </div>
        )}

        {/* Browser Window Wrapper */}
        <div
          className={`bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden transition-all duration-1000 flex flex-col ${hasStarted ? "opacity-100 translate-y-0" : "opacity-60 translate-y-4 pointer-events-none"}`}
        >
          {/* Browser Chrome / Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center gap-4">
            {/* Window Controls (macOS style) */}
            <div className="flex gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Address Bar */}
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-xs text-gray-500 flex items-center shadow-sm">
              <span className="text-gray-400 mr-2">🔒</span>
              {formType.portalUrl}
            </div>
          </div>

          {/* Gov Header */}
          <div className="bg-[#1A4B8C] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 opacity-80" />
              <span className="font-bold text-xl tracking-wider">
                고용노동부 노동포털
              </span>
            </div>
            <div className="text-xs text-blue-200">
              로그인 | 회원가입 | 인증센터
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-gray-100 px-6 py-2 text-xs text-gray-500 border-b border-gray-200 flex items-center gap-2">
            <span>홈</span> &gt; <span>민원신청</span> &gt;{" "}
            <span className="font-semibold text-gray-700">
              {formType.formTitleShort}
            </span>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-10" ref={containerRef}>
            {/* Form Classification Badge */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#1E40AF] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <span className="text-xl">🤖</span>
                <span className="font-bold">
                  AI 자동 판별 서식: {formType.formTitle}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                서식코드: {formType.formCode} | 고용노동부 노동포털 진정·청원
                분류
              </p>
            </div>

            {/* Jurisdiction Info Card */}
            <div className="bg-white border border-gray-200 border-l-4 border-l-blue-600 rounded-lg p-5 mb-8 shadow-sm">
              <h4 className="font-bold border-b border-gray-100 pb-2 mb-3 flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-blue-600" />
                관할관서 자동 판별 결과
              </h4>
              <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm text-gray-600">
                <div className="font-semibold text-gray-500">사업장 주소:</div>
                <div>{companyAddress}</div>
                <div className="font-semibold text-gray-500">관할 관서:</div>
                <div className="font-bold text-gray-800">
                  {jurisdiction.name}
                </div>
                <div className="font-semibold text-gray-500">관서 주소:</div>
                <div>{jurisdiction.address}</div>
                <div className="font-semibold text-gray-500">대표전화:</div>
                <div>{jurisdiction.tel}</div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-green-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> 관할관서 확인 완료
              </div>
              <p className="text-xs text-gray-400 mt-1">
                진정서는 사업장 소재지 관할 고용노동관서에 접수해야 합니다
                (근로감독관집무규정 제37조)
              </p>
            </div>

            <div className="border-b-2 border-gray-800 pb-4 mb-8 flex items-center gap-3">
              <FileText className="w-8 h-8 text-gray-700" />
              <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
                {formType.formTitleShort} 작성
              </h2>
            </div>

            {/* Section 1: 진정인 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A4B8C] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1A4B8C] inline-block"></span>{" "}
                진정인 (Complainant)
              </h3>
              <div className="border-t-2 border-t-[#1A4B8C]">
                {fields.slice(0, 3).map((f) => (
                  <FieldRow key={f.id} field={f} />
                ))}
              </div>
            </div>

            {/* Section 2: 피진정인 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A4B8C] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1A4B8C] inline-block"></span>{" "}
                피진정인 (Respondent)
              </h3>
              <div className="border-t-2 border-t-[#1A4B8C]">
                {fields.slice(3, 7).map((f) => (
                  <FieldRow key={f.id} field={f} />
                ))}
              </div>
            </div>

            {/* Section 3: 진정내용 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A4B8C] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1A4B8C] inline-block"></span>{" "}
                진정내용
              </h3>
              <div className="border-t-2 border-t-[#1A4B8C]">
                {fields.slice(7, 10).map((f) => (
                  <FieldRow key={f.id} field={f} />
                ))}
              </div>
            </div>

            {/* Section 4: 첨부서류 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A4B8C] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1A4B8C] inline-block"></span>{" "}
                첨부서류
              </h3>
              <div className="border-t-2 border-t-[#1A4B8C] flex border-b border-b-gray-200">
                <div className="w-1/3 md:w-1/4 bg-[#F5F5F5] p-3 md:p-4 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center">
                  업로드된 증거 자료
                </div>
                <div className="w-2/3 md:w-3/4 p-3 md:p-4 bg-white">
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${isFinished ? "text-gray-800" : "text-gray-400"}`}
                    >
                      <Check
                        className={`w-4 h-4 ${isFinished ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span>카카오톡_대화내역.png</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Real Portal Integration Flow */}
        {isFinished && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-[fadeIn_0.5s_ease-out_forwards]">
            <button
              onClick={handleFullCopyAndOpenPortal}
              className="flex items-center justify-center gap-3 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-sm"
            >
              <Send className="w-6 h-6" /> 
              노동포털 실제 접수 페이지 열기
            </button>
            <button
              onClick={() => {
                if (onNext) {
                  onNext();
                } else {
                  console.error("onNext prop is not provided");
                }
              }}
              className="flex items-center justify-center gap-3 bg-navy hover:bg-navy/90 text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              다음 단계 안내 보기 →
            </button>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
