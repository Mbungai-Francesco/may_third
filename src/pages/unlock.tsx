import { login } from "@/api/Auth";
import { loadToast } from "@/lib/loadToast";
import { useAuthStore } from "@/store/authStore";
import { UserRole, type LoginDTO } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const Unlock = () => {
	const navigate = useNavigate();
	const { setUser, isAuthenticated } = useAuthStore();


	const handleSubmit = () => {
		const input = document.querySelector(".input-field") as HTMLInputElement;

		const code =
			(typeof import.meta !== "undefined" &&
				(import.meta as any).env &&
				(import.meta as any).env.VITE_CODE) ||
			process.env.VITE_CODE ||
			"";
		const email =
			(typeof import.meta !== "undefined" &&
				(import.meta as any).env &&
				(import.meta as any).env.VITE_EMAIL) ||
			process.env.VITE_EMAIL ||
			"";
		const password =
			(typeof import.meta !== "undefined" &&
				(import.meta as any).env &&
				(import.meta as any).env.VITE_CODE) ||
			process.env.VITE_CODE ||
			"";

		if (input.value.toLowerCase().trim() === code.toLowerCase()) {
			mutate({ email, password })
		} else {
			input.value = "";
			input.placeholder = "Wrong code, try again!";
			input.classList.add("shake");
			setTimeout(() => {
				input.classList.remove("shake");
			}, 500);
		}
	};

	const { mutate } = useMutation({
		mutationFn: (val: LoginDTO) => {
			loadToast("Logging in", "", 0, "blue");
			return login(val);
		},
		onSuccess: (data) => {
			if (data !== null) {
				setUser(data);
				toast.dismiss();
				if (data.role === UserRole.CELEBRANT) navigate("/received");
				else navigate("/sent");
			} else loadToast("Warning", "Wrong credentials", 3000, "red");
		},
		onError: (error) => {
			loadToast("Warning", "Wrong credentials", 3000, "red");
			console.error("Error logging in:", error);
		},
	});

	return (
		<div className="h-screen w-full bg-blob flex items-center justify-center px-6 py-12 overflow-hidden">
			<div className="petal w-10 h-10 top-[8%] left-[10%] rotate-45 bg-[#D6C0B8]"></div>
			<div className="petal w-6 h-6 top-[15%] right-[12%] -rotate-12 bg-[#F2D8CD]"></div>
			<div className="petal w-8 h-8 bottom-[20%] left-[8%] rotate-12 bg-[#D6C0B8]"></div>
			<div className="petal w-5 h-5 bottom-[12%] right-[15%] rotate-45 bg-[#B38E81]"></div>
			<div className="petal w-12 h-12 top-[35%] right-[5%] -rotate-30 bg-[#F2D8CD]"></div>
			<div className="petal w-7 h-7 top-[60%] left-[5%] rotate-20 bg-[#D6C0B8]"></div>

			<div
				className="card-gradient w-full max-w-sm rounded-[2.5rem] px-8 pt-10 pb-8 flex flex-col items-center text-center relative overflow-hidden"
				style={{
					boxShadow:
						"0 20px 60px rgba(179,142,129,0.30), 0 4px 16px rgba(179,142,129,0.15)",
				}}
			>
				{/* <!-- Subtle inner glow at top --> */}
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 blur-2xl rounded-full pointer-events-none"
					style={{ background: "rgba(242,216,205,0.5)" }}
				></div>

				{/* <!-- Lock icon --> */}
				<div
					className="lock-circle w-16 h-16 rounded-full flex items-center justify-center mb-6 z-10"
					style={{ boxShadow: "0 8px 20px rgba(179,142,129,0.4)" }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-7 h-7 text-white"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.2}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
				</div>

				{/* <!-- Hello beautiful --> */}
				<p className="font-vibes hello-text text-4xl mb-1 leading-tight">
					Hello beautiful
				</p>

				{/* <!-- A surprise awaits --> */}
				<h1 className="font-gara text-4xl font-medium text-neutral-800 leading-tight mt-1">
					A surprise
				</h1>
				<h1 className="font-gara italic text-4xl font-medium awaits-text leading-tight mb-5">
					awaits
				</h1>

				{/* <!-- Subtitle --> */}
				<p className="font-gara italic text-xl text-neutral-400 leading-relaxed mb-7 px-2">
					To unlock, simply type in -<br />
					the secret code
				</p>

				{/* <!-- Input --> */}
				<input
					type="text"
					placeholder="Code"
					className="input-field input text-center mb-6 font-semibold text-xl"
				/>

				{/* <!-- Button --> */}
				<button
					className="btn-gradient w-full rounded-full py-4 text-white font-gara text-lg font-medium flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all duration-200 mb-5"
					style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
					onClick={handleSubmit}
				>
					{/* <!-- Sparkle icon --> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
						<path
							d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75L5 15z"
							opacity="0.7"
						/>
					</svg>
					Unlock my surprise
				</button>

				{/* <!-- Signature --> */}
				<p className="font-vibes text-base italic" style={{ color: "#B38E81" }}>
					We love you
				</p>
			</div>
		</div>
	);
};
