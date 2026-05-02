import { api, link } from ".";
import type { Wish, WishCreateDTO, WishUpdateDTO } from "@/types";

const route = "api/wishes";

// Get all wishes
export const getAllWishes = async () => {
	try {
		const res = await api.get(`${link}/${route}`);
		console.log("message", res.statusText);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get a single wish by ID
export const getWishById = async (id: string) => {
	try {
		const res = await api.get(`${link}/${route}/${id}`);
		console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get sent wishes
export const getSentWishes = async () => {
	try {
		const res = await api.get(`${link}/${route}/mine`);
		console.log("message", res.statusText);
		console.log("message", res.data.data);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get my wishes
export const getMyWishes = async () => {
	try {
		const res = await api.get(`${link}/${route}/received`);
		console.log("message", res.statusText);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Create a wish
export const createWish = async (wish: WishCreateDTO) => {
	try {
		const res = await api.post(`${link}/${route}`, wish);
		console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Update a wish
export const updateWish = async (id: string, wish: Partial<WishUpdateDTO>) => {
	try {
		const res = await api.put(`${link}/${route}/${id}`, wish);
		console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Delete a wish by ID
export const deleteWish = async (id: string) => {
	try {
		const res = await api.delete(`${link}/${route}/${id}`);
		console.log("message", res.statusText);
		return true;
	} catch (error) {
		console.error('Error:', error);
		return false;
	}
}


