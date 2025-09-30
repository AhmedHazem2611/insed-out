import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import aiRouter from "./routes/ai.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
	console.log(`API listening on http://${host}:${port}`);
});
