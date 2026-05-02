import { db } from "../lib/db";
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import { setTokenCookie } from "../utils/cookies";


export const createUser = async (req: Request, res: Response) => {
	try {
		const { email, names, password, phone } = req.body;

		if (!email || !names || !password) {
			return res.status(400).json({
				message: "email, names and password are required",
			});
		}

		const existingUser = await db.user.findUnique({ where: { email } });

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await db.user.create({
			data: { email, names, password, phone },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: false,
			},
		});

		const token = generateToken(user.id);

		setTokenCookie(res, token);

		return res.status(201).json({ message: "User created", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "email and password are required" });
		}

		const user = await db.user.findUnique({
			where: { email },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: true, // needed for comparison
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.password !== password) {
			return res.status(400).json({ message: "Invalid password" });
		}

		const token = generateToken(user.id);

		setTokenCookie(res, token);

		const { password: _, ...userWithoutPassword } = user;

		return res
			.status(200)
			.json({ message: "Logged in", data: userWithoutPassword });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const logoutUser = async (req: Request, res: Response) => {
	res.clearCookie("token");
	return res.status(200).json({ message: "Logged out successfully" });
};