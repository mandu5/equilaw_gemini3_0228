import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/**
 * Safely extract JSON from Gemini response text.
 * Handles cases where Gemini wraps JSON in markdown code fences.
 */
function safeParseJson(
  text: string | undefined,
): Record<string, unknown> | null {
  if (!text || text.trim().length === 0) return null;

  let cleaned = text.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error(
      "Failed to parse Gemini response as JSON:",
      cleaned.substring(0, 200),
    );
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("No GEMINI_API_KEY provided. Returning mock data.");
      return NextResponse.json(getMockData());
    }

    const ai = new GoogleGenAI({ apiKey });

    const imagePrompt = `
You are an expert Korean labor law expert (공인노무사).
I am providing evidence of a labor dispute (e.g., KakaoTalk screenshot).
Perform OCR to extract the conversation, analyze who the sender is, the time, and the message content.
Flag any messages that contain labor law violations (e.g., unpaid overtime, threats, denying leave).

Identify specific violations of the Korean Labor Standards Act (근로기준법). For each violation:
- type: short english id (e.g. wage_theft)
- name: Korean name (e.g. 임금체불)
- severity: "Critical" | "High" | "Medium" | "Low"
- description: Korean description
- lawArticle: e.g. "근로기준법 제43조"
- evidenceQuotes: ["exact quote from text"]

Extract numerical data about wages and hours:
- baseSalary (number | null)
- overtimeHours (number | null)
- periodStart (YYYY-MM-DD | null)
- periodEnd (YYYY-MM-DD | null)
- missingInfo: array of strings describing what's missing (e.g. ["월 기본급", "정확한 근무 시간"])

Return ONLY a valid JSON object matching the following structure exactly (no markdown formatting, no comments):
{
  "messages": [
    { "id": "1", "senderName": "Sender", "timestamp": "...", "text": "...", "isViolation": true }
  ],
  "violations": [
    { "type": "", "name": "", "severity": "", "description": "", "lawArticle": "", "evidenceQuotes": [] }
  ],
  "wageData": {
    "baseSalary": null, "overtimeHours": null, "periodStart": null, "periodEnd": null, "missingInfo": []
  }
}
`;

    const audioPrompt = `
You are an expert Korean labor law expert (공인노무사).
Transcribe this Korean audio recording. This is evidence of a labor dispute. 

Task 1: Transcription
Extract: all spoken content in Korean, identify speakers if possible, note any mentions of wages, working hours, overtime, dismissal, or other labor-related topics.

Task 2: Violation Analysis
Based on the transcript from Task 1, identify specific violations of the Korean Labor Standards Act (근로기준법). Flag any statements that contain labor law violations (e.g., unpaid overtime, threats, denying leave).
For each violation:
- type: short english id (e.g. wage_theft)
- name: Korean name (e.g. 임금체불)
- severity: "Critical" | "High" | "Medium" | "Low"
- description: Korean description
- lawArticle: e.g. "근로기준법 제43조"
- evidenceQuotes: ["exact quote from text"]

Task 3: Wage Data Extraction
Extract numerical data about wages and hours:
- baseSalary (number | null)
- overtimeHours (number | null)
- periodStart (YYYY-MM-DD | null)
- periodEnd (YYYY-MM-DD | null)
- missingInfo: array of strings describing what's missing (e.g. ["월 기본급", "정확한 근무 시간"])

Return ONLY a valid JSON object matching the following structure exactly (no markdown formatting, no comments):
{
  "audioAnalysis": {
    "transcript": "full text of the audio",
    "speakers": ["Speaker 1", "Speaker 2"],
    "labor_keywords_found": ["연장근로", "수당"],
    "key_statements": [
      {
        "speaker": "Speaker 1",
        "text": "statement text",
        "timestamp_approximate": "00:15",
        "relevance_to_labor_law": "explanation of relevance"
      }
    ]
  },
  "messages": [
    { "id": "1", "senderName": "Speaker 1", "timestamp": "00:15", "text": "statement text", "isViolation": true }
  ],
  "violations": [
    { "type": "", "name": "", "severity": "", "description": "", "lawArticle": "", "evidenceQuotes": [] }
  ],
  "wageData": {
    "baseSalary": null, "overtimeHours": null, "periodStart": null, "periodEnd": null, "missingInfo": []
  }
}
`;

    const responses = await Promise.all(
      files.map(async (fileObj) => {
        try {
          const file = fileObj as File;
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Data = buffer.toString("base64");

          const isAudio =
            file.type.startsWith("audio/") ||
            file.type.endsWith("m4a") ||
            file.name.endsWith(".m4a");
          const finalPrompt = isAudio ? audioPrompt : imagePrompt;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [
              {
                role: "user",
                parts: [
                  { text: finalPrompt },
                  {
                    inlineData: {
                      data: base64Data,
                      mimeType: file.type || "audio/mp3",
                    },
                  },
                ],
              },
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });

          return safeParseJson(response.text);
        } catch (err) {
          console.error("Error processing an individual file:", err);
          return null; // Ignore failing files
        }
      }),
    );

    // Merge results
    const mergedResult: any = {
      messages: [],
      violations: [],
      wageData: {
        baseSalary: null,
        overtimeHours: null,
        periodStart: null,
        periodEnd: null,
        missingInfo: [],
      },
      audioAnalysis: null,
    };

    const violationTypes = new Set<string>();

    for (const rawRes of responses) {
      if (!rawRes) continue;

      const res = rawRes as any;

      // Merge messages
      if (Array.isArray(res.messages)) {
        mergedResult.messages.push(...res.messages);
      }

      // Merge violations (deduplicated by type)
      if (Array.isArray(res.violations)) {
        for (const v of res.violations) {
          if (v.type && !violationTypes.has(v.type)) {
            violationTypes.add(v.type);
            mergedResult.violations.push(v);
          }
        }
      }

      // Merge wage data (take first non-null)
      if (res.wageData) {
        if (mergedResult.wageData.baseSalary === null)
          mergedResult.wageData.baseSalary = res.wageData.baseSalary;
        if (mergedResult.wageData.overtimeHours === null)
          mergedResult.wageData.overtimeHours = res.wageData.overtimeHours;
        if (mergedResult.wageData.periodStart === null)
          mergedResult.wageData.periodStart = res.wageData.periodStart;
        if (mergedResult.wageData.periodEnd === null)
          mergedResult.wageData.periodEnd = res.wageData.periodEnd;

        if (Array.isArray(res.wageData.missingInfo)) {
          mergedResult.wageData.missingInfo = Array.from(
            new Set([
              ...mergedResult.wageData.missingInfo,
              ...res.wageData.missingInfo,
            ]),
          );
        }
      }

      // Merge audio analysis
      if (res.audioAnalysis) {
        if (!mergedResult.audioAnalysis) {
          mergedResult.audioAnalysis = { ...res.audioAnalysis };
        } else {
          mergedResult.audioAnalysis.transcript +=
            "\n\n---\n\n" + (res.audioAnalysis.transcript || "");
          mergedResult.audioAnalysis.speakers = Array.from(
            new Set([
              ...(mergedResult.audioAnalysis.speakers || []),
              ...(res.audioAnalysis.speakers || []),
            ]),
          );
          mergedResult.audioAnalysis.labor_keywords_found = Array.from(
            new Set([
              ...(mergedResult.audioAnalysis.labor_keywords_found || []),
              ...(res.audioAnalysis.labor_keywords_found || []),
            ]),
          );
          if (Array.isArray(res.audioAnalysis.key_statements)) {
            mergedResult.audioAnalysis.key_statements.push(
              ...res.audioAnalysis.key_statements,
            );
          }
        }
      }
    }

    // Ensure we don't return an empty audioAnalysis if it wasn't populated
    if (!mergedResult.audioAnalysis) {
      delete mergedResult.audioAnalysis;
    }

    return NextResponse.json(mergedResult);
  } catch (error) {
    console.error("Error analyzing evidence:", error);
    return NextResponse.json(
      { error: "증거 분석에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}

function getMockData() {
  return {
    messages: [
      {
        id: "1",
        senderName: "김부장",
        timestamp: "오전 9:15",
        text: "박현우씨, 이번 주말에도 출근해서 남은 업무 마무리하세요.",
        isViolation: false,
      },
      {
        id: "2",
        senderName: "박현우",
        timestamp: "오전 9:17",
        text: "부장님, 주말 특근 수당은 지급되는 건가요? 지난달 초과근무 수당도 못 받았습니다.",
        isViolation: false,
      },
      {
        id: "3",
        senderName: "김부장",
        timestamp: "오전 9:20",
        text: "우리는 포괄임금제라 수당 다 포함되어 있는 거 알잖아. 자꾸 따지면 인사고과에 불이익 갈 줄 알아.",
        isViolation: true,
      },
      {
        id: "4",
        senderName: "김부장",
        timestamp: "오전 9:22",
        text: "그리고 이번 주 금요일에 쓴 연차는 취소해. 바빠 죽겠는데 무슨 연차야.",
        isViolation: true,
      },
    ],
    violations: [
      {
        type: "wage_theft",
        name: "임금체불",
        severity: "Critical",
        description:
          "포괄임금제라 하더라도 실제 근로시간이 포괄된 시간을 초과하는 경우에는 그 초과분에 대해 법정수당을 지급해야 합니다.",
        lawArticle:
          "근로기준법 제43조 (임금 지급) 및 제56조 (연장·야간 및 휴일 근로)",
        evidenceQuotes: [
          "주말 특근 수당은 지급되는 건가요? 지난달 초과근무 수당도 못 받았습니다.",
          "우리는 포괄임금제라 수당 다 포함되어 있는 거 알잖아.",
        ],
      },
      {
        type: "forced_labor",
        name: "강제근로 및 불이익 처우",
        severity: "High",
        description:
          "정당한 이유 없이 인사고과 등의 불이익을 언급하며 연장근로를 강요하는 것은 법 위반입니다.",
        lawArticle:
          "근로기준법 제7조 (강제근로의 금지) 및 제23조 (해고 등의 제한)",
        evidenceQuotes: ["자꾸 따지면 인사고과에 불이익 갈 줄 알아."],
      },
      {
        type: "leave_denial",
        name: "연차휴가 사용 방해",
        severity: "High",
        description:
          "근로자가 청구한 시기에 휴가를 주어야 하며, 사업 운영에 막대한 지장이 있는 경우가 아니라면 임의로 연차를 취소할 수 없습니다.",
        lawArticle: "근로기준법 제60조 (연차유급휴가)",
        evidenceQuotes: [
          "이번 주 금요일에 쓴 연차는 취소해. 바빠 죽겠는데 무슨 연차야.",
        ],
      },
    ],
    wageData: {
      baseSalary: 2500000,
      overtimeHours: 15,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      missingInfo: [],
    },
    audioAnalysis: {
      transcript:
        "김부장: 박현우씨, 저번에 말한 대로 연장수당은 우리 회사는 포괄이라서 못 줍니다. 자꾸 말도 안 되는 소리 할 거면, 내일부터 그냥 안 나오셔도 됩니다.\n박현우: 아니, 부장님. 매일 3시간씩 야근했는데 수당 안 주는 게 어디 있습니까? 그리고 갑자기 해고하시는 건가요?\n김부장: 해고? 본인이 수당 안 준다고 안 나오겠다고 한 거 아니야. 아무튼 그만 얘기해.",
      speakers: ["김부장", "박현우"],
      labor_keywords_found: ["연장수당", "포괄", "해고", "야근"],
      key_statements: [
        {
          speaker: "김부장",
          text: "저번에 말한 대로 연장수당은 우리 회사는 포괄이라서 못 줍니다. 자꾸 말도 안 되는 소리 할 거면, 내일부터 그냥 안 나오셔도 됩니다.",
          timestamp_approximate: "00:02",
          relevance_to_labor_law:
            "포괄임금제 오남용(임금체불) 및 부당해고 시사",
        },
        {
          speaker: "박현우",
          text: "매일 3시간씩 야근했는데 수당 안 주는 게 어디 있습니까?",
          timestamp_approximate: "00:15",
          relevance_to_labor_law: "상시 연장근로 발생 증명",
        },
      ],
    },
  };
}
