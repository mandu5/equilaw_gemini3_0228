import {
  UploadCloud,
  MessageSquare,
  FileText,
  Mic,
  Loader2,
} from "lucide-react";
import { useState, useRef } from "react";

interface UploadStepProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export function UploadStep({ onFilesSelected, isUploading }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-2">증거 자료 업로드</h2>
      <p className="text-gray-600 mb-8 text-center">
        근로기준법 위반을 입증할 수 있는 카카오톡 캡처, 근로계약서, 또는 녹음
        파일을 업로드해주세요.
      </p>

      <form
        className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors relative
          ${isUploading ? "border-navy/40 bg-navy/5 pointer-events-none" : ""}
          ${dragActive && !isUploading ? "border-gold bg-warning-light/30" : ""}
          ${!dragActive && !isUploading ? "border-gray-300 bg-white hover:border-navy" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,audio/*,.pdf"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-16 h-16 text-navy animate-spin mb-4" />
            <p className="text-lg font-medium text-navy animate-pulse">
              AI가 증거를 분석하고 있습니다...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              이미지에서 텍스트를 추출하고 법 위반 사항을 검토합니다.
            </p>
          </div>
        ) : (
          <>
            <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-navy">
              클릭하여 파일 선택 또는 여기로 드래그
            </p>
            <p className="text-sm text-gray-500 mt-2">
              지원 형식: JPG, PNG, WEBP, MP3, WAV, M4A, PDF
            </p>
          </>
        )}
      </form>

      {files.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">
            선택된 파일 ({files.length})
          </h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <span className="truncate flex-1 text-sm font-medium text-gray-800">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(idx)}
                  className="ml-4 text-danger text-sm hover:underline disabled:opacity-40"
                  disabled={isUploading}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <MessageSquare className="w-10 h-10 text-navy mb-3" />
          <h3 className="font-bold text-gray-800">카카오톡 캡처</h3>
          <p className="text-sm text-gray-500 mt-2">
            업무지시, 폭언, 출퇴근 기록 등 대화 내용
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <FileText className="w-10 h-10 text-navy mb-3" />
          <h3 className="font-bold text-gray-800">근로계약서</h3>
          <p className="text-sm text-gray-500 mt-2">
            근로계약서, 급여명세서 등 서류
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <Mic className="w-10 h-10 text-navy mb-3" />
          <h3 className="font-bold text-gray-800">녹음 파일</h3>
          <p className="text-sm text-gray-500 mt-2">
            구두 지시, 해고 통보, 직장 내 괴롭힘 녹음
          </p>
        </div>
      </div>

      <button
        className="mt-12 bg-navy hover:bg-navy/90 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        disabled={files.length === 0 || isUploading}
        onClick={() => onFilesSelected(files)}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            분석 중...
          </>
        ) : (
          "증거 분석 시작 →"
        )}
      </button>
    </div>
  );
}
