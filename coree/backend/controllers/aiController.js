import { runCoreGuide, runReporter, runRoutinePlanner } from '../services/aiService.js';

export async function guideHandler(req, res) {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    const reply = await runCoreGuide(prompt);
    return res.json({ reply });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}

export async function reportHandler(req, res) {
  try {
    const { transcript } = req.body || {};
    if (!transcript) return res.status(400).json({ error: 'Missing transcript' });
    const reply = await runReporter(transcript);
    return res.json({ reply });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}

export async function routineHandler(req, res) {
  try {
    const { transcript } = req.body || {};
    if (!transcript) return res.status(400).json({ error: 'Missing transcript' });
    const reply = await runRoutinePlanner(transcript);
    return res.json({ reply });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
} 