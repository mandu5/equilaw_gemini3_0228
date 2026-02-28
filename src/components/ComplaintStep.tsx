import { Copy, Download, FileSignature } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { AgentActivityMonitor } from "./AgentActivityMonitor";

interface ComplaintStepProps {
  complaintData: {
    complainantName: string;
    complainantPhone: string;
    complainantAddress: string;
    companyName: string;
    companyRep: string;
    companyAddress: string;
    purpose: string;
    details: string;
    attachments: string[];
  } | null;
  wageData: any;
  messages: any[];
  violations: any[];
  onUpdate: (field: string, value: string) => void;
  isLoading: boolean;
  onNext: () => void;
}

export function ComplaintStep({
  complaintData,
  wageData,
  messages,
  violations,
  onUpdate,
  isLoading,
  onNext,
}: ComplaintStepProps) {
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const complaintRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.style.height = "auto";
      detailsRef.current.style.height = `${detailsRef.current.scrollHeight}px`;
    }
  }, [complaintData?.details]);

  if (isLoading || !complaintData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center print:hidden">
        <div className="w-16 h-16 border-4 border-navy border-t-gold rounded-full animate-spin mb-6 mx-auto"></div>
        <h2 className="text-xl font-bold text-navy animate-pulse">
          📝 진정서 작성 중...
        </h2>
        <p className="text-gray-500 mt-2">
          법률 양식에 맞게 문서를 작성하고 있습니다.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (!complaintData) return;
    const textToCopy = `진 정 서
진정인: ${complaintData.complainantName}
피진정인: ${complaintData.companyName}

진정 취지
${complaintData.purpose}

진정 내용
${complaintData.details}
`;
    navigator.clipboard.writeText(textToCopy);
    alert("진정서 내용이 복사되었습니다.");
  };

  if (!complaintData) return null;

  const handleDownload = () => {
    window.print();
  };

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="w-full flex flex-col items-center relative">
      <AgentActivityMonitor isComplete={true} />
      <div
        ref={complaintRef}
        className="w-full max-w-[800px] bg-white text-black font-serif shadow-xl print:shadow-none print:max-w-none print:w-full mx-auto px-4 md:px-10 py-8 md:py-16 print:px-0 print:py-0 border border-gray-200 print:border-none"
      >
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-[1em] ml-[1em]">
            진 정 서
          </h1>
        </div>

        {/* People Info Table */}
        <table className="w-full border-collapse border-2 border-black mb-12 text-sm">
          <tbody>
            {/* Complainant */}
            <tr>
              <th className="border border-black bg-gray-100 w-24 py-3 align-middle text-center font-bold">
                진 정 인<br />
                (근로자)
              </th>
              <td className="border border-black p-0">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th className="border-b border-r border-black bg-gray-50 w-20 py-2 font-medium">
                        성 명
                      </th>
                      <td className="border-b border-r border-black px-3 w-1/3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.complainantName}
                          onChange={(e) =>
                            onUpdate("complainantName", e.target.value)
                          }
                        />
                      </td>
                      <th className="border-b border-r border-black bg-gray-50 w-20 py-2 font-medium">
                        연 락 처
                      </th>
                      <td className="border-b border-black px-3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.complainantPhone}
                          onChange={(e) =>
                            onUpdate("complainantPhone", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="border-r border-black bg-gray-50 py-2 font-medium">
                        주 소
                      </th>
                      <td colSpan={3} className="px-3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.complainantAddress}
                          onChange={(e) =>
                            onUpdate("complainantAddress", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Respondent */}
            <tr>
              <th className="border border-black bg-gray-100 py-3 align-middle text-center font-bold">
                피진정인
                <br />
                (사업주)
              </th>
              <td className="border border-black p-0">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th className="border-b border-r border-black bg-gray-50 w-20 py-2 font-medium">
                        사업체명
                      </th>
                      <td className="border-b border-r border-black px-3 w-1/3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.companyName}
                          onChange={(e) =>
                            onUpdate("companyName", e.target.value)
                          }
                        />
                      </td>
                      <th className="border-b border-r border-black bg-gray-50 w-20 py-2 font-medium">
                        대 표 자
                      </th>
                      <td className="border-b border-black px-3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.companyRep}
                          onChange={(e) =>
                            onUpdate("companyRep", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="border-r border-black bg-gray-50 py-2 font-medium">
                        주 소
                      </th>
                      <td colSpan={3} className="px-3">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 transition-colors"
                          value={complaintData.companyAddress}
                          onChange={(e) =>
                            onUpdate("companyAddress", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Purpose */}
        <div className="mb-10">
          <h2 className="text-lg font-bold border-b-2 border-black mb-4 pb-1">
            ■ 진 정 취 지
          </h2>
          <textarea
            className="w-full min-h-[60px] outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 p-2 resize-y leading-relaxed"
            value={complaintData.purpose}
            onChange={(e) => onUpdate("purpose", e.target.value)}
          />
        </div>

        {/* Details */}
        <div className="mb-10">
          <h2 className="text-lg font-bold border-b-2 border-black mb-4 pb-1">
            ■ 진 정 내 용
          </h2>
          <textarea
            ref={detailsRef}
            className="w-full min-h-[300px] outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 p-2 resize-none overflow-hidden leading-loose text-justify"
            value={complaintData.details}
            onChange={(e) => onUpdate("details", e.target.value)}
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* Attachments */}
        <div className="mb-16">
          <h2 className="text-lg font-bold border-b-2 border-black mb-4 pb-1">
            ■ 첨 부 서 류
          </h2>
          <ul className="list-decimal pl-8 space-y-2">
            {complaintData.attachments.length > 0 ? (
              complaintData.attachments.map((file, i) => (
                <li key={i}>{file}</li>
              ))
            ) : (
              <li className="text-gray-500 italic">첨부 자료 없음</li>
            )}
          </ul>
        </div>

        {/* Signatures */}
        <div className="text-center mt-16 space-y-10">
          <p className="text-lg tracking-widest">{dateStr}</p>
          <div className="flex justify-center items-center text-lg gap-4">
            <span>위 진정인:</span>
            <input
              type="text"
              className="w-32 text-center outline-none bg-transparent hover:bg-yellow-50 focus:bg-yellow-50 focus:ring-1 ring-blue-400 border-b border-black font-bold"
              value={complaintData.complainantName}
              onChange={(e) => onUpdate("complainantName", e.target.value)}
            />
            <span className="flex items-center gap-1">
              (서명 또는 인)
              <FileSignature className="w-5 h-5 text-gray-400 print:hidden" />
            </span>
          </div>
          <p className="text-2xl font-bold tracking-widest pt-8">
            지방고용노동청장 귀하
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-white border-2 border-navy text-navy hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition-colors shadow-sm"
        >
          <Copy className="w-5 h-5" /> 내용 복사하기
        </button>
        <button
          onClick={handleDownload}
          disabled={isGeneratingPdf}
          className="flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              PDF 생성 중...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" /> PDF로 인쇄/저장
            </>
          )}
        </button>
      </div>

      <div className="flex justify-center mt-12 print:hidden mb-8">
        <button
          onClick={onNext}
          className="flex items-center gap-3 bg-navy hover:bg-navy/90 text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
        >
          자동 접수 시뮬레이션으로 이동
        </button>
      </div>
    </div>
  );
}
