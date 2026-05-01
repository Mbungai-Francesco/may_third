// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload & { id: string };
			file?: Express.Multer.File; // <-- add this
			files?: Express.Multer.File[]; // <-- optional, for multiple files
		}
	}
}
