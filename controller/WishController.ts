import { log } from "node:console";
import { db } from "../lib/db";
import { Request, Response } from "express";

export const createWish = async (req: Request, res: Response) => {
	try {
		const { friendId, title, content, date, time, town } = req.body;
		const userId: string = req.user.userId;

		if (!title || !content || !date || !time) {
			return res
				.status(400)
				.json({ message: "title, content, date and time are required" });
		}

		const wish = await db.wish.create({
			data: {
				userId,
				friendId: friendId || null,
				title,
				content,
				date: new Date(date),
				time,
				town: town || null,
			},
			include: {
				user: { select: { id: true, names: true, pic: true } },
				friend: { select: { id: true, names: true, pic: true } },
			},
		});

		return res.status(201).json({ message: "Wish created", data: wish });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// get all wishes (admin)
export const getWishes = async (req: Request, res: Response) => {
	try {
		const wishes = await db.wish.findMany({
			where: { deleted: false },
			include: {
				user: { select: { id: true, names: true, pic: true } },
				friend: { select: { id: true, names: true, pic: true } },
			},
			orderBy: { date: "desc" },
		});

		// if (!wishes || wishes.length === 0) {
		// 	return res.status(404).json({ message: "No wishes found" });
		// }

		return res.status(200).json({ message: "Wishes found", data: wishes });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// get single wish by id
export const getWish = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const wish = await db.wish.findUnique({
			where: { id },
			include: {
				user: { select: { id: true, names: true, pic: true } },
				friend: { select: { id: true, names: true, pic: true } },
			},
		});

		if (!wish || wish.deleted) {
			return res.status(404).json({ message: "Wish not found" });
		}
		// mark as opened if the friend is reading it		
		if (req.user.userId === wish.friendId && !wish.opened) {
			await db.wish.update({ where: { id }, data: { opened: true } });
		}

		return res.status(200).json({ message: "Wish found", data: wish });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// get all wishes authored by logged in user
export const getMyWishes = async (req: Request, res: Response) => {
	try {
		const userId : string = req.user.userId;

		const wishes = await db.wish.findMany({
			where: { userId, deleted: false },
			include: {
				friend: { select: { id: true, names: true, pic: true } },
			},
			orderBy: { date: "desc" },
		});

		return res.status(200).json({ message: "My wishes", data: wishes });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// get all wishes received by logged in user
export const getReceivedWishes = async (req: Request, res: Response) => {
	try {
		const friendId : string = req.user.userId;

		const wishes = await db.wish.findMany({
			where: { friendId, deleted: false },
			include: {
				user: { select: { id: true, names: true, pic: true } },
			},
			orderBy: { date: "desc" },
		});

		return res.status(200).json({ message: "Received wishes", data: wishes });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateWish = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const userId : string = req.user.userId;
		const { title, content, opened, town } = req.body;

		const wish = await db.wish.findUnique({ where: { id } });

		if (!wish || wish.deleted) {
			return res.status(404).json({ message: "Wish not found" });
		}

		if (wish.userId !== userId) {
			return res
				.status(403)
				.json({ message: "Not allowed to update this wish" });
		}

		const updated = await db.wish.update({
			where: { id },
			data: {
				title,
				content,
				opened,
				town: town || null,
			},
			include: {
				user: { select: { id: true, names: true, pic: true } },
				friend: { select: { id: true, names: true, pic: true } },
			},
		});

		return res.status(200).json({ message: "Wish updated", data: updated });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// soft delete
export const deleteWish = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const userId : string = req.user.userId;

		const wish = await db.wish.findUnique({ where: { id } });

		if (!wish || wish.deleted) {
			return res.status(404).json({ message: "Wish not found" });
		}

		if (wish.userId !== userId) {
			return res
				.status(403)
				.json({ message: "Not allowed to delete this wish" });
		}

		await db.wish.update({ where: { id }, data: { deleted: true } });

		return res.status(200).json({ message: "Wish deleted" });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// friend reacts to a wish
export const reactToWish = async (req: Request, res: Response) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const { reaction } = req.body;
		const userId : string = req.user.userId;

		const wish = await db.wish.findUnique({ where: { id } });

		if (!wish || wish.deleted) {
			return res.status(404).json({ message: "Wish not found" });
		}

		if (wish.friendId !== userId) {
			return res
				.status(403)
				.json({ message: "Only the recipient can react to this wish" });
		}

		const updated = await db.wish.update({
			where: { id },
			data: { reaction },
		});

		return res.status(200).json({ message: "Reaction saved", data: updated });
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};