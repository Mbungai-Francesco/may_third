import { api, link, conf } from ".";
import type { Reaction, Wish, WishCreateDTO, WishUpdateDTO } from "@/types";

const route = "api/wishes";

// Get all wishes
export const getAllWishes = async (jwt: string) => {
	try {
		const res = await api.get(`${link}/${route}`, conf(jwt));
		// console.log("message", res.statusText);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get a single wish by ID
export const getWishById = async (id: string, jwt: string) => {
	try {
		const res = await api.get(`${link}/${route}/${id}`, conf(jwt));
		// console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get sent wishes
export const getSentWishes = async (jwt: string) => {
	try {
		const res = await api.get(`${link}/${route}/mine`, conf(jwt));
		// console.log("message", res.statusText);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Get my wishes
export const getMyWishes = async (jwt: string	) => {
	try {
		const res = await api.get(`${link}/${route}/received`, conf(jwt));
		// console.log("message", res.statusText);
		return res.data.data as Array<Wish>;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Create a wish
export const createWish = async (wish: WishCreateDTO, jwt: string) => {
	try {
		const res = await api.post(`${link}/${route}`, wish, conf(jwt));
		// console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Update a wish
export const updateWish = async (id: string, wish: Partial<WishUpdateDTO>, jwt: string) => {
	try {
		console.log(wish);
		
		const res = await api.put(`${link}/${route}/${id}`, wish, conf(jwt));
		// console.log("message", res.statusText);
		// console.log(res.data.data);
		
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// React to a wish
export const reactToWish = async (id: string, reaction: Reaction, jwt: string) => {
	try {
		const res = await api.put(
			`${link}/${route}/react/${id}`,
			{ reaction },
			conf(jwt),
		);
		// console.log("message", res.statusText);
		return res.data.data as Wish;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

// Delete a wish by ID
export const deleteWish = async (id: string, jwt: string) => {
	try {
		await api.delete(`${link}/${route}/${id}`, conf(jwt));
		// console.log("message", res.statusText);
		return true;
	} catch (error) {
		console.error('Error:', error);
		return false;
	}
}


