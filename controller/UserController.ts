import { db } from "../lib/db";
import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
	try {
    const id : string = req.user.id;
    
		const user = await db.user.findUnique({
			where: { id: id },
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

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({ message: "User found", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await db.user.findMany({
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

		if (!users || users.length === 0) {
			return res.status(404).json({ message: "No users found" });
		}

		return res.status(200).json({ message: "Users found", data: users });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const user = await db.user.findUnique({
			where: { id },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: false,
				authoredWishes: true,
				receivedWishes: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({ message: "User found", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const { names, phone, pic } = req.body;

    const existingUser = await db.user.findUnique({ where: { id } });

		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}

		const user = await db.user.update({
			where: { id },
			data: { names, phone, pic },
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

		return res.status(200).json({ message: "User updated", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		await db.user.delete({ where: { id } });

		res.clearCookie("token");
		return res.status(200).json({ message: "User deleted" });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
