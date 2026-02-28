"use client";

import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

export interface LogEntry {
  timeMs: number;
  text: string;
  agentProcess: "Coordinator" | "Input" | "Legal" | "Action";
}

const AGENT_LOGS: LogEntry[] = [
  {
    timeMs: 0,
    agentProcess: "Coordinator",
    text: "[0.0s] 🚀 EquiLaw Multi-Agent System initialized",
  },
  {
    timeMs: 500,
    agentProcess: "Coordinator",
    text: "[0.5s] 📋 Coordinator Agent: Analyzing input type...",
  },
  {
    timeMs: 1000,
    agentProcess: "Coordinator",
    text: "[1.0s] 📋 Coordinator Agent: Image detected → Routing to Input Agent",
  },
  {
    timeMs: 1500,
    agentProcess: "Input",
    text: "[1.5s] 🔍 Input Agent: Starting Korean OCR extraction...",
  },
  {
    timeMs: 3000,
    agentProcess: "Input",
    text: "[3.0s] 🔍 Input Agent: 13 messages extracted from KakaoTalk screenshot",
  },
  {
    timeMs: 3500,
    agentProcess: "Input",
    text: "[3.5s] 🔍 Input Agent: Participants identified — 김부장 (employer rep), 박현우 (employee)",
  },
  {
    timeMs: 4000,
    agentProcess: "Coordinator",
    text: "[4.0s] 📋 Coordinator Agent: Evidence extracted → Routing to Legal Analysis Agent",
  },
  {
    timeMs: 4500,
    agentProcess: "Legal",
    text: "[4.5s] ⚖️ Legal Agent: [Thinking Mode: HIGH] Analyzing against 근로기준법...",
  },
  {
    timeMs: 6000,
    agentProcess: "Legal",
    text: "[6.0s] ⚖️ Legal Agent: ⚠️ 제43조 (임금지급) 위반 감지 — Confidence: 95%",
  },
  {
    timeMs: 6500,
    agentProcess: "Legal",
    text: "[6.5s] ⚖️ Legal Agent: ⚠️ 제56조 (연장근로수당) 위반 감지 — Confidence: 92%",
  },
  {
    timeMs: 7000,
    agentProcess: "Legal",
    text: "[7.0s] ⚖️ Legal Agent: ⚠️ 제60조 (연차유급휴가) 위반 감지 — Confidence: 88%",
  },
  {
    timeMs: 7500,
    agentProcess: "Legal",
    text: "[7.5s] ⚖️ Legal Agent: 📌 2024.12.19 대법원 판례 반영 — 통상임금 확대 적용",
  },
  {
    timeMs: 8500,
    agentProcess: "Legal",
    text: "[8.5s] 💰 Legal Agent: Calculating unpaid overtime...",
  },
  {
    timeMs: 9500,
    agentProcess: "Legal",
    text: "[9.5s] 💰 Legal Agent: 연장근로수당 미지급액: ₩861,244 (80h × ₩14,354 × 1.5 - ₩0)",
  },
  {
    timeMs: 10500,
    agentProcess: "Coordinator",
    text: "[10.5s] ✅ Coordinator Agent: Analysis complete → 5 violations detected, 1 calculation done",
  },
  {
    timeMs: 11000,
    agentProcess: "Action",
    text: "[11.0s] 📝 Action Agent: Ready to generate 진정서",
  },
];

const COLORS = {
  Coordinator: "text-white",
  Input: "text-[#67E8F9]", // cyan
  Legal: "text-[#FBBF24]", // gold
  Action: "text-[#4ADE80]", // green
};

interface AgentActivityMonitorProps {
  isComplete: boolean;
  externalLogs?: LogEntry[];
}

export function AgentActivityMonitor({
  isComplete,
  externalLogs,
}: AgentActivityMonitorProps) {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Always expanded initially
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-expand when external logs come in (active simulation)
  useEffect(() => {
    if (externalLogs && externalLogs.length > 0) {
      if (!isExpanded) setIsExpanded(true);
    }
  }, [externalLogs?.length]);

  useEffect(() => {
    // If using external logs, just render them directly
    if (externalLogs) {
      setVisibleLogs(externalLogs);
      setIsThinking(false);
      return;
    }

    let timeouts: NodeJS.Timeout[] = [];
    const startTime = Date.now();
    let completedIndex = -1;

    // Fast-forward or clear timeouts if analysis completes early
    if (isComplete) {
      setVisibleLogs(AGENT_LOGS);
      setIsThinking(false);
      return;
    }

    const processNextLog = (index: number) => {
      if (index >= AGENT_LOGS.length || isComplete) return;

      const log = AGENT_LOGS[index];
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, log.timeMs - elapsed);

      const timeout = setTimeout(() => {
        setVisibleLogs((prev) => {
          // Check if already contains to avoid react strict mode double renders
          if (prev.find((l) => l.timeMs === log.timeMs)) return prev;
          return [...prev, log];
        });
        completedIndex = index;

        // If this is the last log before isComplete, show thinking
        if (index === AGENT_LOGS.length - 1 && !isComplete) {
          setIsThinking(true);
        } else {
          processNextLog(index + 1);
        }
      }, delay);
      timeouts.push(timeout);
    };

    setVisibleLogs([]);
    setIsThinking(false);
    processNextLog(0);

    return () => timeouts.forEach(clearTimeout);
  }, [isComplete, externalLogs]);

  // Handle thinking placeholder when we hit the end but still "loading"
  useEffect(() => {
    if (externalLogs) return; // Disable thinking state override for external logs

    let interval: NodeJS.Timeout;
    if (isThinking && !isComplete) {
      setVisibleLogs((prev) => {
        const baseThinking = {
          timeMs: 99999,
          agentProcess: "Legal" as const,
          text: "⚖️ Legal Agent: Reasoning...",
        };
        // remove previous thinking if exists
        const cleaned = prev.filter((l) => l.timeMs !== 99999);
        return [...cleaned, baseThinking];
      });

      let dots = 0;
      interval = setInterval(() => {
        dots = (dots + 1) % 4;
        const text = `⚖️ Legal Agent: Reasoning${".".repeat(dots)}`;
        setVisibleLogs((prev) => {
          return prev.map((l) => (l.timeMs === 99999 ? { ...l, text } : l));
        });
      }, 500);
    } else if (isComplete && visibleLogs.some((l) => l.timeMs === 99999)) {
      // Remove thinking state when done
      setVisibleLogs(AGENT_LOGS);
    }

    return () => clearInterval(interval);
  }, [isThinking, isComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#17263F] hover:bg-[#0F1A2E] text-gray-200 border border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full px-5 py-3 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-[1.03] group animate-[fadeIn_0.5s_ease-out]"
      >
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </div>
        <span className="font-semibold text-sm mr-1">🤖 Agent Status</span>
        <Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[420px] h-[450px] flex flex-col bg-[#0F1A2E] text-gray-300 font-mono text-xs sm:text-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#17263F] border-b border-gray-700/50 cursor-default">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="font-bold text-gray-200 tracking-wide">
            Agent Activity Monitor
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700/50 transition-colors"
          title="최소화"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Log Terminal */}
      <div
        ref={containerRef}
        className="flex-1 p-5 overflow-y-auto space-y-2.5 scroll-smooth custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        {visibleLogs.map((log, i) => (
          <div
            key={log.timeMs + i}
            className={`opacity-0 animate-[fadeIn_0.2s_ease-out_forwards] ${COLORS[log.agentProcess]} leading-relaxed`}
          >
            {/* Timestamp pulsing */}
            <span className="text-gray-500 mr-2 opacity-0 animate-[pulseTimestamp_0.5s_ease-out_forwards]">
              {log.text.match(/^(\[\d+\.\ds\])/)?.[1] || ""}
            </span>
            {/* Main log text */}
            <span className="">{log.text.replace(/^\[\d+\.\ds\]\s/, "")}</span>
          </div>
        ))}
        {!isComplete && (
          <div className="mt-2 inline-block w-2.5 h-4 bg-gray-400 animate-pulse"></div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseTimestamp {
          0% {
            opacity: 0;
            color: #fff;
          }
          50% {
            opacity: 1;
            color: #fff;
          }
          100% {
            opacity: 1;
            color: #6b7280;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
