import { logout } from "@/api/Auth";
import { deleteWish, getSentWishes } from "@/api/WishApi";
import { loadToast } from "@/lib/loadToast";
// import { CheckLogin } from '@/lib/checkLogin';
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const Sent = () => {
	const queryClient = useQueryClient();

	const navigate = useNavigate();
	const { isAuthenticated, user, setUser } = useAuthStore();

	// CheckLogin(isAuthenticated, navigate)
	useEffect(() => {
		if (!isAuthenticated) navigate("/login");
		queryClient.invalidateQueries({ queryKey: ["wishes"] });
	}, );
	// Fetching values
	const { isPending, data: wishes } = useQuery({
		queryKey: ["wishes"],
		queryFn: () => getSentWishes(user?.jwt || ""),
	});

	const { mutate: deleteWishFn } = useMutation({
		mutationFn: (val: string) => {
			loadToast("Deleting wish", "", 0, "blue");
			return deleteWish(val, user?.jwt || "");
		},
		onSuccess: (data) => {
			if (data !== null) {
				toast.dismiss();
				toast.success("Wish deleted successfully!");
				navigate(-1); // Go back to previous page
			} else {
				loadToast("Warning", "Error deleting wish", 3000, "red");
			}
		},
		onError: (error) => {
			loadToast("Warning", "Error deleting wish", 3000, "red");
			console.error("Error deleting wish:", error);
		},
	});

	return (
		<div className="bg-blob h-screen flex flex-col p-6 overflow-y-scroll gap-2">
			<div className="flex justify-between items-center">
				<p className="font-gara font-semibold italic text-2xl text-neutral-700 leading-relaxed px-2">
					Hey{" "}
					<span className="font-bold text-black">{user?.names || "Moon"}</span>
				</p>
				<div
					onClick={()=>{
						logout().then(() =>{
							setUser(null)
							navigate('/login')
						}
						)
					}}
				>
					<X />
				</div>
			</div>

			{isPending ? (
				<p>Loading wishes...</p>
			) : (
				<div>
					{wishes?.map((wish) => (
						<div
							key={wish.id}
							className="bg-white rounded-lg shadow-md p-4 mb-4"
						>
							<h3 className="font-bold text-lg">{wish.title}</h3>
							<p className="text-gray-600">{wish.content}</p>
							<div className="flex gap-2 mt-4">
								<button
									onClick={() => navigate(`/form/wish/${wish.id}`)}
									className="flex items-center gap-2 px-3 py-2 rounded transition border border-[#B38E81] bg-[#B38E81] text-white shadow-sm hover:bg-[#D6C0B8] hover:text-[#3f2f29]"
								>
									<Edit size={18} />
									Update
								</button>
								<button
									onClick={() => {
										if (confirm("Are you sure you want to delete this wish?")) {
											deleteWishFn(wish.id);
										}
									}}
									className="flex items-center gap-2 px-3 py-2 rounded transition border border-[#D6C0B8] bg-[#F2D8CD] text-[#3f2f29] shadow-sm hover:bg-[#D6C0B8]"
								>
									<Trash2 size={18} />
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<button
				type="submit"
				className="btn-gradient auth-button"
				style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
				onClick={() => navigate("/form/wish")}
			>
				Click to add A wish
			</button>
		</div>
	);
};
