import fs from "fs";

async function runTest() {
  console.log("--- 1. Testing /api/analyze ---");
  const evidenceContent = fs.readFileSync("dummy_evidence.txt");

  const blob = new Blob([evidenceContent], { type: "text/plain" });
  const formData = new FormData();
  formData.append("files", blob, "dummy_evidence.txt");

  const analyzeRes = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!analyzeRes.ok) {
    console.error("Analyze API failed:", await analyzeRes.text());
    return;
  }

  const analyzeData = await analyzeRes.json();
  console.log("✅ Analysis Result:", JSON.stringify(analyzeData, null, 2));

  console.log("\n--- 2. Testing /api/generate-complaint ---");
  const complaintRes = await fetch(
    "http://localhost:3001/api/generate-complaint",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        violations: analyzeData.violations,
        wageData: analyzeData.wageData,
        messages: analyzeData.messages,
      }),
    },
  );

  if (!complaintRes.ok) {
    console.error("Complaint API failed:", await complaintRes.text());
    return;
  }

  const complaintData = await complaintRes.json();
  console.log(
    "✅ Complaint Generation Result:",
    JSON.stringify(complaintData, null, 2),
  );
}

runTest();
