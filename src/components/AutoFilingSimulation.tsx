"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ShieldCheck, FileText, Send } from "lucide-react";
import { LogEntry } from "./AgentActivityMonitor";

interface AutoFilingSimulationProps {
  wageData: any;
  messages: any[];
  violations: any[];
  onLogsUpdate: (logs: LogEntry[]) => void;
  onComplete: () => void;
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
  onLogsUpdate,
  onComplete,
}: AutoFilingSimulationProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract representative data from evidence (simple heuristics for demo)
  const complainantName = "박현우"; // Employee name from the prompt example
  const respondentName = "한솔제조"; // Company name from prompt example

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
          await new Promise((r) => setTimeout(r, 30)); // 30ms per char typing speed
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
        await new Promise((r) => setTimeout(r, 400));
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
      <div className="w-1/3 md:w-1/4 bg-[#F5F5F5] p-3 md:p-4 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center">
        {field.label}
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
    <div className="w-full flex flex-col items-center mt-12 mb-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full max-w-[900px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🖥️</span> 자동 접수 시뮬레이션
        </h3>

        {/* Start Button Overlay */}
        {!hasStarted && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
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

        {/* Government Form Replica */}
        <div
          className={`bg-white border-2 border-[#1A4B8C] shadow-2xl overflow-hidden transition-all duration-1000 ${hasStarted ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 pointer-events-none"}`}
        >
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
            <span className="font-semibold text-gray-700">임금체불 진정서</span>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-10" ref={containerRef}>
            <div className="border-b-2 border-gray-800 pb-4 mb-8 flex items-center gap-3">
              <FileText className="w-8 h-8 text-gray-700" />
              <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
                임금체불 진정서 작성
              </h2>
            </div>

            {/* Section 1: 진정인 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A4B8C] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#1A4B8C] inline-block"></span>{" "}
                진정인 (Complainant)
              </h3>
              <div className="border-t-2 border-[#1A4B8C]">
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
              <div className="border-t-2 border-[#1A4B8C]">
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
              <div className="border-t-2 border-[#1A4B8C]">
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
              <div className="border-t-2 border-[#1A4B8C] flex border-b border-gray-200">
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

            {/* Completion Banner */}
            {isFinished && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-green-800 mb-2">
                  ✅ 모든 필드 자동 입력 완료
                </h4>
                <p className="text-green-600 mb-6">
                  총 10개 항목 및 첨부파일이 지정된 양식에 맞게 입력되었습니다.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
                  >
                    👁️ 내용 검토하기
                  </button>
                  <button className="px-6 py-2.5 bg-[#1A4B8C] hover:bg-[#1A4B8C]/90 text-white font-bold rounded flex items-center gap-2 transition-colors shadow-md">
                    <Send className="w-4 h-4" /> 접수하기 (최종 제출)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
