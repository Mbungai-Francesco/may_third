import { api, link } from ".";
import type { User, UserUpdateDTO } from "@/types";

const route = "api/users";

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await api.get(`${link}/${route}`);
    console.log("message", res.statusText);
    return res.data.data as Array<User>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single user by ID
export const getUserById = async (id: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get me
export const getMe = async () => {
  try {
    // console.log(link);
    
    const res = await api.get(`${link}/${route}/me`);
    console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user
export const updateUser = async (id: string, user: Partial<UserUpdateDTO>) => {
  try {
    const res = await api.put(`${link}/${route}/${id}`, user);
    console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user's password
export const updatePassword = async (id: string, password: string) => {
  try {
    const res = await api.put(`${link}/${route}/password/${id}`, { password })
    console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user's image
export const updateImage = async (id: string, image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const res = await api.put(`${link}/${route}/image/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("message", res.statusText);
    return res.data.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a user by ID
export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
