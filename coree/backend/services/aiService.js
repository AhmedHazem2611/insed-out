import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.CHAT_API_BASE_URL || 'https://api.openai.com/v1';
const API_KEY = process.env.CHAT_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'gpt-4o-mini';

if (!API_KEY) {
  throw new Error('CHAT_API_KEY is not set');
}

function readPromptFile(fileName) {
  const p = path.resolve(process.cwd(), 'prompts', fileName);
  return fs.readFileSync(p, { encoding: 'utf-8' });
}

const coreGuidePrompt = readPromptFile('core_guide.txt');
const reporterPrompt = readPromptFile('reporter_role.txt');
const routinePrompt = readPromptFile('routine_planner_role.txt');

async function chatCompletion(messages) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`AI provider error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || '';
  return reply;
}

export async function runCoreGuide(userText) {
  const messages = [
    { role: 'system', content: coreGuidePrompt },
    { role: 'user', content: userText },
  ];
  return await chatCompletion(messages);
}

export async function runReporter(transcript) {
  const messages = [
    { role: 'system', content: reporterPrompt },
    { role: 'user', content: transcript },
  ];
  return await chatCompletion(messages);
}

export async function runRoutinePlanner(transcript) {
  const messages = [
    { role: 'system', content: routinePrompt },
    { role: 'user', content: transcript },
  ];
  return await chatCompletion(messages);
} 