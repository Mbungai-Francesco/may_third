import { db } from "../lib/db";
import { Request, Response } from "express";
import { uploadImageToCloud } from "../lib/uploadImage";

export const getMe = async (req: Request, res: Response) => {
	try {
    const id: string = req.user.userId;

    
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
				receivedWishes: true,
				sentWishes: true,
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

		// if (!users || users.length === 0) {
		// 	return res.status(404).json({ message: "No users found" });
		// }

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
		const { names, phone, email, town } = req.body;

		const userId: string = req.user.userId;

		if(userId !== id){
			return res
				.status(403)
				.json({ message: "Only a user can modify their info" });
		}

    const existingUser = await db.user.findUnique({ where: { id } });

		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}

		const user = await db.user.update({
			where: { id },
			data: { names, phone, email, town },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: false,
				receivedWishes: true,
				sentWishes: true,
			},
		});

		return res.status(200).json({ message: "User updated", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updatePassword = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const { password } = req.body;

		const userId: string = req.user.userId;

		if(userId !== id){
			return res
				.status(403)
				.json({ message: "Only a user can modify their info" });
		}

    const existingUser = await db.user.findUnique({ where: { id } });

		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}

		const user = await db.user.update({
			where: { id },
			data: { password },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: false,
				receivedWishes: true,
				sentWishes: true,
			},
		});

		return res.status(200).json({ message: "User updated", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const uploadImage = async (req: Request, res: Response) =>{
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const userId: string = req.user.userId;

		if (userId !== id) {
			return res
				.status(403)
				.json({ message: "Only a user can modify their picture" });
		}

		const existingUser = await db.user.findUnique({ where: { id } });

		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}		

		let imageUrl: string | undefined;
		if (req.file) {
			imageUrl = await uploadImageToCloud(req.file.buffer);
		}else{
			return res.status(400).json({ message: "Upload an image" });
		}

		const user = await db.user.update({
			where: { id },
			data: { pic: imageUrl },
			select: {
				id: true,
				names: true,
				email: true,
				phone: true,
				role: true,
				pic: true,
				password: false,
				receivedWishes: true,
				sentWishes: true,
			},
		});

		return res.status(200).json({ message: "Profile image added", data: user });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const userId: string = req.user.userId;

		if (userId !== id) {
			return res
				.status(403)
				.json({ message: "Only a user can delete their account" });
		}

		await db.user.delete({ where: { id } });

		res.clearCookie("token");
		return res.status(200).json({ message: "User deleted" });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
