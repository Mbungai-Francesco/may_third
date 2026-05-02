import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router"

export const Home = () => {
	const { isAuthenticated } = useAuthStore()
	const navigate = useNavigate()

	if (!isAuthenticated) {
	  navigate("/login");
	}else{
	  navigate("/sent")
	}

	return (
		<div>
			<button
				className="btn-gradient w-full rounded-full py-4 text-white font-gara text-lg font-medium flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all duration-200 mb-5"
				style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
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
				To unlock
			</button>
			<button
				className="btn-gradient w-full rounded-full py-4 text-white font-gara text-lg font-medium flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all duration-200 mb-5"
				style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
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
		</div>
	);
}
