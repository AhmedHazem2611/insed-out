import type { Request, Response } from "express";
import { z } from "zod";
import { spawn } from "node:child_process";
import { Buffer } from "node:buffer";
import { readFileSync, existsSync } from "node:fs";

const schema = z.object({ prompt: z.string().min(1) });

function loadSystemPrompt(): string {
	const fromEnv = process.env.CHAT_SYSTEM_PROMPT;
	const fromFile = process.env.CHAT_SYSTEM_PROMPT_FILE;
	if (fromFile && existsSync(fromFile)) {
		try { return readFileSync(fromFile, { encoding: "utf-8" }); } catch {}
	}
	return fromEnv || "You are a warm, supportive therapist. Speak briefly and clearly.";
}

export async function aiReplyHandler(req: Request, res: Response) {
	const parse = schema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: "Invalid input" });
	}
	const { prompt } = parse.data;

	const usePy = process.env.USE_PY_AI === "true";

	if (usePy) {
		const pythonCmd = process.env.PYTHON_CMD || "python";
		try {
			const reply = await runPythonChatOnce(pythonCmd, prompt);
			return res.json({ reply });
		} catch (e: any) {
			return res.status(502).json({ error: e?.message || "Python AI failed" });
		}
	}

	const baseUrl = process.env.CHAT_API_BASE_URL || "https://api.openai.com/v1";
	const apiKey = process.env.CHAT_API_KEY;
	const model = process.env.CHAT_MODEL || "gpt-4o-mini";
	const systemPrompt = loadSystemPrompt();

	if (!apiKey) {
		return res.status(503).json({ error: "AI is not configured. Set CHAT_API_KEY and CHAT_API_BASE_URL." });
	}

	try {
		const response = await fetch(`${baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model,
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: prompt },
				],
			}),
		});

		if (!response.ok) {
			let details = `upstream HTTP ${response.status}`;
			try { const body = await response.text(); details += `: ${body}`; } catch {}
			return res.status(502).json({ error: `AI provider error: ${details}` });
		}

		const data = await response.json() as any;
		const reply: string = data?.choices?.[0]?.message?.content || "I'm here with you.";
		return res.json({ reply });
	} catch (err) {
		return res.status(500).json({ error: "Failed to contact AI provider" });
	}
}

function runPythonChatOnce(pythonCmd: string, prompt: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const scriptPath = new URL("../../AI/chat_once.py", import.meta.url).pathname;
		const child = spawn(pythonCmd, [scriptPath, prompt], {
			stdio: ["ignore", "pipe", "pipe"],
			env: process.env,
		});
		let stdout = Buffer.alloc(0);
		let stderr = Buffer.alloc(0);
		child.stdout.on("data", (d) => (stdout = Buffer.concat([stdout, d])));
		child.stderr.on("data", (d) => (stderr = Buffer.concat([stderr, d])));
		child.on("error", (err) => reject(err));
		child.on("close", (code) => {
			if (code === 0) {
				const text = stdout.toString("utf8").trim();
				return resolve(text || "");
			}
			return reject(new Error(stderr.toString("utf8").trim() || `Python exited with code ${code}`));
		});
	});
} 