import { api, link, conf } from ".";
import type { User, UserUpdateDTO } from "@/types";

const route = "api/users";

// Get all users
export const getAllUsers = async (jwt: string ) => {
  try {
    const res = await api.get(`${link}/${route}`, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as Array<User>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single user by ID
export const getUserById = async (id: string, jwt: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}`, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get me
export const getMe = async (jwt: string) => {
  try {
    // console.log(link);
    
    const res = await api.get(`${link}/${route}/me`, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user
export const updateUser = async (id: string, user: Partial<UserUpdateDTO>, jwt: string) => {
  try {
    const res = await api.put(`${link}/${route}/${id}`, user, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user's password
export const updatePassword = async (id: string, password: string, jwt: string) => {
  try {
    const res = await api.put(`${link}/${route}/password/${id}`, { password }, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user's image
export const updateImage = async (id: string, image: File, jwt: string) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const res = await api.put(`${link}/${route}/image/${id}`, formData, conf(jwt));
    // console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a user by ID
export const deleteUser = async (id: string, jwt: string) => {
  try {
    const res = await api.delete(`${link}/${route}/${id}`, conf(jwt));
    // console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
