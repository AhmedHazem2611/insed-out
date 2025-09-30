import { z } from "zod";
const schema = z.object({ prompt: z.string().min(1) });
export async function aiReplyHandler(req, res) {
    const parse = schema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { prompt } = parse.data;
    // Simple supportive response synthesis (placeholder for real AI)
    const reply = `I hear: "${prompt}". Let's notice the pattern together. This is not a flaw in you — it's a pattern we can illuminate.`;
    return res.json({ reply });
}
//# sourceMappingURL=ai.controller.js.map