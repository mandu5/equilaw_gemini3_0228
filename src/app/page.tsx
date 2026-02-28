"use client";

import { useState } from "react";
import { Stepper } from "@/components/Stepper";
import { UploadStep } from "@/components/UploadStep";
import {
  DashboardStep,
  ExtractedMessage,
  Violation,
  WageData,
  AudioAnalysis,
} from "@/components/DashboardStep";
import { ComplaintStep } from "@/components/ComplaintStep";
import { AutoFilingStep } from "@/components/AutoFilingStep";
import { NextStepsStep } from "@/components/NextStepsStep";
import { XCircle } from "lucide-react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data states
  const [messages, setMessages] = useState<ExtractedMessage[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [wageData, setWageData] = useState<WageData | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(
    null,
  );

  const [complaintData, setComplaintData] = useState<{
    complainantName: string;
    complainantPhone: string;
    complainantAddress: string;
    companyName: string;
    companyRep: string;
    companyAddress: string;
    purpose: string;
    details: string;
    attachments: string[];
  } | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsAnalyzing(true);
    setErrorMessage(null);
    setCurrentStep(2);
    setAnalysisStatus("📷 이미지에서 텍스트 추출 중...");

    try {
      await new Promise((r) => setTimeout(r, 2000));
      setAnalysisStatus("🔍 대화 참여자 식별 중...");

      await new Promise((r) => setTimeout(r, 2000));
      setAnalysisStatus("⚖️ 노동법 위반 사항 분석 중...");

      // Prepare form data for API upload
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      // Fetch from our API
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "분석에 실패했습니다.");
      }

      setMessages(result.messages || []);
      setViolations(result.violations || []);
      setWageData(result.wageData || null);
      setAudioAnalysis(result.audioAnalysis || null);
    } catch (error) {
      console.error(error);
      const msg =
        error instanceof Error
          ? error.message
          : "파일 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setErrorMessage(msg);
      setCurrentStep(1);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateComplaint = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsGenerating(true);
    setErrorMessage(null);
    setCurrentStep(3);

    try {
      const res = await fetch("/api/generate-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ violations, wageData, messages }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "진정서 생성 실패");
      }

      setComplaintData(result.complaintData);
    } catch (error) {
      console.error(error);
      const msg =
        error instanceof Error
          ? error.message
          : "진정서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setErrorMessage(msg);
      setCurrentStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateComplaintField = (field: string, value: string) => {
    if (complaintData) {
      setComplaintData({ ...complaintData, [field]: value });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section (Visible only on Step 1) */}
      {currentStep === 1 && (
        <div className="w-full bg-navy text-white rounded-2xl p-8 mb-8 text-center shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            EquiLaw <span className="text-gold text-3xl md:text-4xl">⚖️</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-100 mb-4">
            AI 노동법 위반 분석 및 진정서 자동 작성
          </h2>
          <p className="text-blue-50 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            카카오톡 대화, 근로계약서, 녹음 파일을 업로드하면 AI가 노동법 위반
            사항을 정확하게 분석하고, 노동청 제출용 진정서를 자동으로 작성해
            드립니다.
          </p>
        </div>
      )}
      {currentStep !== 1 && (
        <div className="mb-6 text-center animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold tracking-tight text-navy flex items-center justify-center gap-2">
            EquiLaw <span className="text-gold text-xl">⚖️</span>
          </h2>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="w-full max-w-4xl mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-600 text-sm font-medium"
          >
            닫기
          </button>
        </div>
      )}

      <Stepper currentStep={currentStep} />

      <div className="w-full mt-4">
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UploadStep
              onFilesSelected={handleFilesSelected}
              isUploading={isAnalyzing}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DashboardStep
              messages={messages}
              violations={violations}
              wageData={wageData}
              audioAnalysis={audioAnalysis}
              onWageUpdate={(newData) => {
                setWageData((prev) => ({
                  baseSalary: null,
                  overtimeHours: null,
                  periodStart: null,
                  periodEnd: null,
                  missingInfo: [],
                  ...prev,
                  ...newData,
                }));
              }}
              onNext={generateComplaint}
              isLoading={isAnalyzing}
              loadingStatus={analysisStatus}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ComplaintStep
              complaintData={complaintData}
              wageData={wageData}
              messages={messages}
              violations={violations}
              onUpdate={updateComplaintField}
              isLoading={isGenerating}
              onNext={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setCurrentStep(4);
              }}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AutoFilingStep
              wageData={wageData}
              messages={messages}
              violations={violations}
              complaintData={complaintData}
              onNext={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setCurrentStep(5);
              }}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <NextStepsStep />
          </div>
        )}
      </div>
    </div>
  );
}
