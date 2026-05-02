import { logout } from "@/api/Auth";
import { getMe } from "@/api/UserApi";
import type { User } from "@/types";
import { create } from "zustand";

type AuthState = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;

	fetchUser: () => Promise<void>;
	setUser: (user: User | null) => void;
	logOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: false,
	isAuthenticated: false,

	setUser: (user) =>
		set({
			user,
			isAuthenticated: !!user,
		}),

	fetchUser: async () => {
		set({ isLoading: true });
		getMe(useAuthStore.getState().user?.jwt || '').then((data) => {
      if(data !== null)
			set({
				user: data,
				isAuthenticated: true,
				isLoading: false,
			});
      else set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
		});
	},

	logOut: async () => {
		try {
			await logout();
			set({
				user: null,
				isAuthenticated: false,
			});
		} catch (error) {
			console.error("Logout failed:", error);
		}
	},
}));
