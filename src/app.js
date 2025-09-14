import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import healthRouter from "./routes/health.js";
import tourismRouter from "./routes/tourism.js";
import chatRouter from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 라우트 설정
app.use("/health", healthRouter);
app.use("/api/tourism", tourismRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Welcome to 관대 백엔드 API",
    endpoints: {
      health: "/health",
      tourism: "/api/tourism",
      chat: "/api/chat",
    },
  });
});

export default app;
