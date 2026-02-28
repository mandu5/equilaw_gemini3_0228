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
    const { violations, wageData, messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No GEMINI_API_KEY. Using mock complaint generator.");
      return NextResponse.json(getMockComplaint());
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a Korean labor law expert (공인노무사).
Based on the following evidence and violations, draft a formal "진 정 서" (Complaint Document) directed to the 고용노동부.

Violations found: ${JSON.stringify(violations)} 
Wage Calculation Data: ${JSON.stringify(wageData)}
Evidence Transcript: ${JSON.stringify(messages)}

I need you to generate JSON containing the text for different sections of the complaint form. The document must be extremely formal, polite but firm, and use standard legal Korean.
CRITICAL INSTRUCTIONS FOR THE NARRATIVE:
- You MUST explicitly cite specific dates, times, and quotes from the "Evidence Transcript".
- You MUST explicitly state the exact unpaid amounts if available in the "Wage Calculation Data". Include base salary, overtime hours, night hours, holiday hours, and total calculated amount to clearly show the breakdown.
- You MUST explicitly reference the correct "lawArticle" (근로기준법 제OO조) from the "Violations found".

Respond EXACTLY with this JSON structure:
{
  "complaintData": {
    "purpose": "진정 취지 (e.g. 피진정인은 진정인에게 2026년 1월분 등 체불임금 및 연장근로수당 금 000,000원을 지급하라는 지시를 구합니다...)",
    "details": "진정 내용 (Detailed narrative proving the violations. MUST explicitly reference dates from messages, exact amounts from wageData, and lawArticles from violations.)",
    "attachments": ["카카오톡 캡처 1부", "기타 증빙 자료 등"]
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const result = safeParseJson(response.text);

    if (!result) {
      return NextResponse.json(
        { error: "AI 응답을 처리할 수 없습니다. 다시 시도해주세요." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      complaintData: {
        complainantName: "홍길동",
        complainantPhone: "010-0000-0000",
        complainantAddress: "서울특별시 ㅇㅇ구 ㅇㅇ동",
        companyName: "(주)ㅇㅇㅇ",
        companyRep: "김대표",
        companyAddress: "서울특별시 ㅇㅇ구 ㅇㅇ동 사업장",
        ...(result.complaintData as Record<string, unknown>),
      },
    });
  } catch (error) {
    console.error("Error generating complaint:", error);
    return NextResponse.json(
      { error: "진정서 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}

function getMockComplaint() {
  return {
    complaintData: {
      complainantName: "박현우",
      complainantPhone: "010-1234-5678",
      complainantAddress: "서울특별시 강남구 테헤란로 123",
      companyName: "(주)테스트기업",
      companyRep: "김부장",
      companyAddress: "서울특별시 서초구 서초대로 456",
      purpose:
        "피진정인은 진정인에게 미지급된 연장근로수당 금 269,130원을 지급하고, 근로기준법 제60조 등 노동관계법령 위반 사항에 대한 적법한 조치를 취할 것을 요구합니다.",
      details:
        "1. 진정인은 피진정인이 운영하는 사업장에서 근로하고 있습니다.\n\n2. 피진정인은 포괄임금제를 이유로 주말 및 야간 초과근무 수당에 대한 지급을 거부하였으며(근로기준법 제43조, 제56조 위반), 이에 대한 정당한 지급 요구에 대해 인사고과 불이익을 언급하며 협박하였습니다(근로기준법 제23조 위반).\n\n3. 또한 진정인이 적법하게 신청한 연차유급휴가에 대해서도 일방적으로 취소를 강요하는 등 연차휴가 사용을 방해하였습니다(근로기준법 제60조 위반).\n\n4. 체불된 임금 내역은 다음과 같습니다.\n- 월 기본급: 2,500,000원 (통상시급: 약 11,961원)\n- 확인된 연장근로 시간: 15시간\n- 체불 연장근로수당: 11,961원 × 1.5배 × 15시간 = 269,130원\n\n5. 이에 진정인은 피진정인의 위법 행위를 철저히 조사하여 주시고, 미지급된 수당이 신속히 지급될 수 있도록 조치하여 주시기 바랍니다.",
      attachments: [
        "카카오톡 대화 캡처 자료 1부",
        "근로시간 기록부 (해당하는 경우) 1부",
      ],
    },
  };
}
