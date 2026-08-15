export const ARCHITECT_PROMPT = `
You are the Lead Full-Stack React Architect.
Task: Create a complete, standalone, production-ready React component with Tailwind CSS based on the user request and context.
Rules:
1. Do NOT use broken relative imports (e.g., './components/...'). Inline necessary sub-components and mock state in this single file.
2. Use standard Lucide-react icons and clean React 18 hooks.
3. Dark cyber/athletic aesthetics (#0B0E14, emerald, cyan, neon accents).
4. Output ONLY the code inside a single standard TSX codeblock:
\`\`\`tsx
// complete working React App
\`\`\`
`;

export const QA_TESTER_PROMPT = `
You are Agent 2: Lead Runtime QA & Syntax Testing LLM.
Inspect the React TSX code for fatal bugs, runtime crashes, missing subcomponents, and compilation errors.
Output ONLY the healed/verified code inside a single \`\`\`tsx code block. No explanations.
`;

export const UX_POLISHER_PROMPT = `
You are Agent 3: Senior UX & Feature Expansion LLM.
Elevate the verified React code to peak visual and interactive quality.
Ensure all buttons, tabs, interactive scoreboards, and navigation items have working state logic.
Output ONLY the final perfected code inside a single \`\`\`tsx code block. No explanations.
`;

export const EXPLAINER_PROMPT = `
You are the Principal Solutions Architect.
Review the finalized React application code and the user's original request.
Write a clear, high-value technical post-mortem covering:
1. **What was implemented**: Key features, UI modules, and state logic.
2. **Why this architecture was optimal**: Explain technical decisions (e.g. self-contained modularization, high-performance state handling, SVG overlays).
Format using bold headings and bullet points. Keep it under 200 words.
`;

export interface GenerateResult {
  code: string;
  modelUsed: string;
  explanation: string;
  stepsLog: string[];
}

export function cleanCodeFence(raw: string): string {
  let cleaned = raw.trim();
  const codeBlockRegex = /```(?:tsx|jsx|typescript|javascript)?(?::[^\n]*)?\n([\s\S]*?)```/g;
  const matches = [...cleaned.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    const longest = matches.reduce((prev, curr) => (curr[1].length > prev[1].length ? curr : prev));
    return longest[1].trim();
  }

  const startIdx = cleaned.search(/(?:import\s+React|export\s+default|function\s+App)/);
  if (startIdx !== -1) {
    cleaned = cleaned.substring(startIdx);
  }

  return cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
}

/**
 * Modern Gemini 3 Series free tier endpoints (1,500 RPD)
 */
async function callGemini3(apiKey: string, modelName: string, systemPrompt: string, userContent: string): Promise<string> {
  const cleanKey = apiKey.trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;
  const fullPrompt = `${systemPrompt}\n\n=== CONTEXT & SPECIFICATION ===\n${userContent}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateAutonomousPipeline(
  apiKey: string,
  userPrompt: string,
  contextFilesSummary: string,
  onStatusUpdate: (status: string) => void
): Promise<GenerateResult> {
  // Try modern Gemini 3 series in order
  const modelsToTry = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite-preview'
  ];

  let activeModel = modelsToTry[0];
  let lastError: any = null;

  const combinedInput = contextFilesSummary
    ? `EXISTING SOURCE CODE CONTEXT:\n${contextFilesSummary}\n\nUSER REQUEST:\n${userPrompt}`
    : userPrompt;

  for (const model of modelsToTry) {
    try {
      activeModel = model;
      onStatusUpdate(`🤖 Agent 1/3 (Architect): Drafting with ${model}...`);
      
      const architectRaw = await callGemini3(apiKey, model, ARCHITECT_PROMPT, combinedInput);
      let currentCode = cleanCodeFence(architectRaw);

      // STAGE 2: QA & Syntax Tester LLM
      onStatusUpdate(`🔍 Agent 2/3 (QA Tester): Running compiler verification with ${model}...`);
      const qaPrompt = `User Request:\n${userPrompt}\n\nCode to Verify:\n${currentCode}`;
      const qaRaw = await callGemini3(apiKey, model, QA_TESTER_PROMPT, qaPrompt);
      const qaFixedCode = cleanCodeFence(qaRaw);
      if (qaFixedCode && qaFixedCode.length > 100) {
        currentCode = qaFixedCode;
      }

      // STAGE 3: UX & Polish Tester LLM
      onStatusUpdate(`✨ Agent 3/3 (UX Polisher): Elevating Cyberpunk HUD with ${model}...`);
      const polishPrompt = `User Request:\n${userPrompt}\n\nVerified Code to Polish:\n${currentCode}`;
      const polishRaw = await callGemini3(apiKey, model, UX_POLISHER_PROMPT, polishPrompt);
      const polishedCode = cleanCodeFence(polishRaw);
      if (polishedCode && polishedCode.length > 100) {
        currentCode = polishedCode;
      }

      // STAGE 4: Architectural Post-Mortem Report
      onStatusUpdate(`🧠 Generating architectural breakdown with ${model}...`);
      const explanationRaw = await callGemini3(
        apiKey,
        model,
        EXPLAINER_PROMPT,
        `User Request:\n${userPrompt}\n\nFinal Code:\n${currentCode}`
      );

      onStatusUpdate(`🚀 Live Sandbox Ready!`);

      return {
        code: currentCode,
        modelUsed: model,
        explanation: explanationRaw.trim(),
        stepsLog: [`Architect, QA, and UX verified using ${model}`]
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next candidate...`, err?.message);
    }
  }

  throw lastError || new Error('Failed to generate with Gemini 3 models.');
}
