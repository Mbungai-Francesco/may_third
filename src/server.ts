import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import cors from "cors";
import AuthRoutes from "../routes/AuthRoutes";
import { authenticateToken } from "../middleware/auth";
import UserRoutes from "../routes/UserRoutes";
import WishRoutes from "../routes/WishRoutes";


const app = express();

app.use(
	cors({
		origin: true, // reflects the request origin, works with credentials
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Welcome to May 3rd API services" });
});

app.use(
	"/api",
	AuthRoutes,
	authenticateToken,
	UserRoutes,
	WishRoutes
);

// 404 handler (must be AFTER routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
	console.log(
		`May 3rd server running on port ${PORT} : \nlocalhost: http://localhost:${PORT}`,
	);
});
