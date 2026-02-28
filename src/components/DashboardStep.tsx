import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Info,
  Scale,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AgentActivityMonitor } from "./AgentActivityMonitor";

export interface Violation {
  type: string;
  name: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  lawArticle: string;
  evidenceQuotes: string[];
}

export interface ExtractedMessage {
  id: string;
  senderName: string;
  timestamp: string;
  text: string;
  isViolation: boolean;
}

export interface KeyStatement {
  speaker: string;
  text: string;
  timestamp_approximate: string;
  relevance_to_labor_law: string;
}

export interface AudioAnalysis {
  transcript: string;
  speakers: string[];
  labor_keywords_found: string[];
  key_statements: KeyStatement[];
}

export interface WageData {
  baseSalary: number | null;
  overtimeHours: number | null;
  nightHours?: number | null;
  holidayHours?: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  calculatedAmount?: number;
  calculationFormula?: string;
  missingInfo: string[];
}

interface WageInputs {
  baseSalary: number | "";
  overtimeHours: number | "";
  nightHours: number | "";
  holidayHours: number | "";
}

interface WageBreakdown {
  hourlyWage: number;
  overtimePay: number;
  nightPay: number;
  holidayPayFirst8: number;
  holidayPayExtra: number;
  totalHolidayPay: number;
  total: number;
}

function calcWage(inputs: WageInputs): WageBreakdown | null {
  const base = Number(inputs.baseSalary);
  if (!base) return null;

  const hourlyWage = Math.floor(base / 209);
  const overtime = Number(inputs.overtimeHours) || 0;
  const night = Number(inputs.nightHours) || 0;
  const holiday = Number(inputs.holidayHours) || 0;

  const overtimePay = Math.floor(hourlyWage * 1.5 * overtime);
  const nightPay = Math.floor(hourlyWage * 0.5 * night);

  const holidayFirst8 = Math.min(holiday, 8);
  const holidayExtra = Math.max(holiday - 8, 0);
  const holidayPayFirst8 = Math.floor(hourlyWage * 1.5 * holidayFirst8);
  const holidayPayExtra = Math.floor(hourlyWage * 2.0 * holidayExtra);
  const totalHolidayPay = holidayPayFirst8 + holidayPayExtra;

  const total = overtimePay + nightPay + totalHolidayPay;

  return {
    hourlyWage,
    overtimePay,
    nightPay,
    holidayPayFirst8,
    holidayPayExtra,
    totalHolidayPay,
    total,
  };
}

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

interface DashboardStepProps {
  messages: ExtractedMessage[];
  violations: Violation[];
  wageData: WageData | null;
  audioAnalysis?: AudioAnalysis | null;
  onNext: () => void;
  onWageUpdate: (newData: Partial<WageData>) => void;
  isLoading: boolean;
  loadingStatus?: string;
}

export function DashboardStep({
  messages,
  violations,
  audioAnalysis,
  onNext,
  onWageUpdate,
  isLoading,
  loadingStatus,
}: DashboardStepProps) {
  const [inputs, setInputs] = useState<WageInputs>({
    baseSalary: "",
    overtimeHours: "",
    nightHours: "",
    holidayHours: "",
  });

  const breakdown = calcWage(inputs);

  useEffect(() => {
    onWageUpdate({
      baseSalary: Number(inputs.baseSalary) || null,
      overtimeHours: Number(inputs.overtimeHours) || null,
      nightHours: Number(inputs.nightHours) || null,
      holidayHours: Number(inputs.holidayHours) || null,
      calculatedAmount: breakdown?.total || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, breakdown?.total]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 h-[600px]">
        {/* Left: Spinner (70%) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-navy/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-navy rounded-full border-t-transparent animate-spin"></div>
            <Scale className="absolute inset-0 m-auto w-8 h-8 text-navy animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            AI 법률 분석 중...
          </h2>
          <p className="text-gray-500 max-w-md text-center">
            {loadingStatus}
            <br />
            업로드된 자료와 근로기준법 판례를 대조하고 있습니다. 잠시만
            기다려주세요 (최대 30초 소요).
          </p>
        </div>

        {/* Right: Agent Activity Monitor (30%) */}
        <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 h-full">
          <AgentActivityMonitor isComplete={false} />
        </div>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
            심각 (Critical)
          </span>
        );
      case "High":
        return (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            높음 (High)
          </span>
        );
      case "Medium":
        return (
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            보통 (Medium)
          </span>
        );
      default:
        return (
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            낮음 (Low)
          </span>
        );
    }
  };

  const field = (
    label: string,
    sub: string,
    key: keyof WageInputs,
    placeholder: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <span className="ml-1 text-xs text-gray-400 font-normal">{sub}</span>
      </label>
      <input
        type="number"
        min={0}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition"
        value={inputs[key]}
        onChange={(e) =>
          setInputs((prev) => ({
            ...prev,
            [key]: e.target.value === "" ? "" : Number(e.target.value),
          }))
        }
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Main Dashboard Content */}
      <div className="flex-1 space-y-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-navy/10 text-navy rounded-full flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                법률 분석 완료
              </h3>
              <p className="text-sm text-gray-500">
                아래 분석 결과를 확인하고 진정서 작성 단계로 이동하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm shrink-0"
          >
            진정서 작성 단계로 이동
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Transcription Panel */}
        {audioAnalysis && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-navy text-white px-4 py-3 font-semibold border-b border-gray-200">
              음성 녹취록 분석
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transcript */}
              <div className="flex flex-col h-full max-h-[400px]">
                <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">
                  전체 스크립트
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg overflow-y-auto flex-1 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 leading-relaxed">
                  {audioAnalysis.transcript}
                </div>
              </div>

              {/* Analysis Data */}
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">
                    발화자 및 주요 키워드
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {audioAnalysis.speakers.map((s, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                      >
                        👤 {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {audioAnalysis.labor_keywords_found.map((k, i) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium border border-red-200"
                      >
                        ⚠️ {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[250px] pr-2">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">
                    사건 관련 핵심 발언
                  </h4>
                  <div className="space-y-3">
                    {audioAnalysis.key_statements.map((stmt, i) => (
                      <div
                        key={i}
                        className="bg-orange-50 p-3 rounded-lg border border-orange-200"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-gray-800">
                            {stmt.speaker}
                          </span>
                          <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded shadow-sm">
                            {stmt.timestamp_approximate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                          &quot;{stmt.text}&quot;
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-navy font-medium border border-gray-100 flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange-500" />
                          <span>{stmt.relevance_to_labor_law}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top row: Messages and Violations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel A: Extracted Messages */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
            <div className="bg-navy text-white px-4 py-3 font-semibold border-b border-gray-200 sticky top-0">
              대화 내역 (추출된 증거)
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col p-3 rounded-lg border-l-4 shadow-sm bg-white
                  ${msg.isViolation ? "border-l-red-500 bg-red-50/30" : "border-l-gray-300"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-gray-800 flex items-center gap-1">
                      {msg.senderName}
                      {msg.isViolation && (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {msg.text}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                  추출된 대화 내역이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Panel B: Violation Report */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
            <div className="bg-navy text-white px-4 py-3 flex justify-between items-center font-semibold sticky top-0">
              <span>위반 사항 분석 결과</span>
              <span className="bg-gold text-navy text-xs px-2 py-1 rounded-full font-bold">
                총 {violations.length}건 발견
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {violations.map((v, idx) => (
                <div
                  key={idx}
                  className="border border-red-200 rounded-lg p-4 bg-red-50/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-600 w-5 h-5" />
                      <h3 className="font-bold text-navy text-lg">{v.name}</h3>
                    </div>
                    {getSeverityBadge(v.severity)}
                  </div>
                  <div className="bg-white px-3 py-1 border border-gray-200 rounded text-sm text-navy font-mono mb-3 inline-block">
                    {v.lawArticle}
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {v.description}
                  </p>
                  {v.evidenceQuotes && v.evidenceQuotes.length > 0 && (
                    <div className="bg-gray-100 p-2 rounded text-xs text-gray-600 italic border-l-2 border-gray-300">
                      &quot; {v.evidenceQuotes[0]} &quot;
                    </div>
                  )}
                </div>
              ))}
              {violations.length === 0 && (
                <div className="text-center flex flex-col items-center justify-center text-gray-400 py-10 h-full">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  발견된 법 위반 사항이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel C: Enhanced Wage Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-navy text-white px-4 py-3 font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            <span>체불임금 / 수당 계산기</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-5">
                <h4 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-navy" />
                  기준 정보 입력
                </h4>
                {field("월 기본급", "(원)", "baseSalary", "예: 2,500,000")}
                {field(
                  "연장근로 시간",
                  "(시간, 평일 8h 초과)",
                  "overtimeHours",
                  "예: 15",
                )}
                {field(
                  "야간근로 시간",
                  "(시간, 오후 10시~오전 6시)",
                  "nightHours",
                  "예: 8",
                )}
                {field(
                  "휴일근로 시간",
                  "(시간, 주휴일/공휴일)",
                  "holidayHours",
                  "예: 10",
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                  <p className="font-semibold">📌 계산 기준 (근로기준법)</p>
                  <p>
                    · 연장근로수당: 통상시급 × <strong>1.5배</strong>
                  </p>
                  <p>
                    · 야간근로수당: 통상시급 × <strong>0.5배</strong>{" "}
                    (연장수당과 중복 가산)
                  </p>
                  <p>
                    · 휴일근로수당(8h 이내): 통상시급 × <strong>1.5배</strong>
                  </p>
                  <p>
                    · 휴일근로수당(8h 초과분): 통상시급 × <strong>2.0배</strong>
                  </p>
                </div>
              </div>

              {/* Output / Breakdown Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">
                  계산 결과 상세
                </h4>

                {!breakdown ? (
                  <div className="text-gray-400 italic text-sm py-4">
                    월 기본급을 입력하면 자동으로 계산됩니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Hourly Wage */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          ① 통상시급
                        </span>
                        <span className="font-bold text-navy">
                          {won(breakdown.hourlyWage)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {won(Number(inputs.baseSalary))} ÷ 209
                      </p>
                    </div>

                    {/* Overtime */}
                    {Number(inputs.overtimeHours) > 0 && (
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 font-medium">
                            ② 연장근로수당
                          </span>
                          <span className="font-bold text-orange-700">
                            {won(breakdown.overtimePay)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {won(breakdown.hourlyWage)} × 1.5 ×{" "}
                          {inputs.overtimeHours}h
                        </p>
                      </div>
                    )}

                    {/* Night */}
                    {Number(inputs.nightHours) > 0 && (
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 font-medium">
                            ③ 야간근로수당
                          </span>
                          <span className="font-bold text-indigo-700">
                            {won(breakdown.nightPay)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {won(breakdown.hourlyWage)} × 0.5 ×{" "}
                          {inputs.nightHours}h
                        </p>
                      </div>
                    )}

                    {/* Holiday */}
                    {Number(inputs.holidayHours) > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 font-medium">
                            ④ 휴일근로수당
                          </span>
                          <span className="font-bold text-purple-700">
                            {won(breakdown.totalHolidayPay)}
                          </span>
                        </div>
                        {Number(inputs.holidayHours) <= 8 ? (
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {won(breakdown.hourlyWage)} × 1.5 ×{" "}
                            {inputs.holidayHours}h
                          </p>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1 font-mono space-y-0.5">
                            <p>
                              8h 이내: {won(breakdown.hourlyWage)} × 1.5 × 8h ={" "}
                              {won(breakdown.holidayPayFirst8)}
                            </p>
                            <p>
                              8h 초과: {won(breakdown.hourlyWage)} × 2.0 ×{" "}
                              {Number(inputs.holidayHours) - 8}h ={" "}
                              {won(breakdown.holidayPayExtra)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Total */}
                    <div className="bg-red-600 text-white rounded-xl p-5 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">
                          총 미지급 수당
                        </span>
                        <span className="text-3xl font-extrabold tracking-tight">
                          {won(breakdown.total)}
                        </span>
                      </div>
                      <p className="text-xs text-red-200 mt-2">
                        ※ 실제 수당은 근로계약서 및 취업규칙에 따라 달라질 수
                        있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Agent Activity Monitor Layout (Persistent after load) */}
      <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col gap-6">
        {/* The monitor itself, constrained to match the height of typically the first couple of cards or use a sticky behavior if desired */}
        <div className="sticky top-6 h-[600px]">
          <AgentActivityMonitor isComplete={true} />
        </div>
      </div>
    </div>
  );
}
