import { logout } from "@/api/Auth";
import { deleteWish, getSentWishes } from "@/api/WishApi";
import { loadToast } from "@/lib/loadToast";
// import { CheckLogin } from '@/lib/checkLogin';
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Edit, MoreVertical, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const Sent = () => {
	const queryClient = useQueryClient();
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	const navigate = useNavigate();
	const { isAuthenticated, user, setUser } = useAuthStore();

	// CheckLogin(isAuthenticated, navigate)
	useEffect(() => {
		if (!isAuthenticated) navigate("/login");
		queryClient.invalidateQueries({ queryKey: ["wishes"] });
	}, [isAuthenticated, navigate, queryClient]);
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
				<div className="flex items-center gap-3">
					<div
						className="cursor-pointer"
						onClick={() => {
							queryClient.invalidateQueries({ queryKey: ["wishes"] });
						}}
					>
						<RefreshCw />
					</div>
					<div
						onClick={() => {
							logout().then(() => {
								setUser(null);
								navigate("/login");
							});
						}}
					>
						<X />
					</div>
				</div>
			</div>

			{isPending ? (
				<p>Loading wishes...</p>
			) : (
				<div>
					{wishes?.map((wish) => (
						<div
							key={wish.id}
							className="bg-white rounded-lg shadow-md p-4 mb-4 relative"
						>
							<div className="flex items-start gap-3">
								<div className="cursor-pointer grow flex justify-between items-center">
									<div onClick={() => navigate(`/wish/${wish.id}`)}>
										<h3 className="font-bold text-lg">{wish.title}</h3>
										<p className="text-gray-600">{wish.content}</p>
									</div>
									<CheckCheck className={`
										${wish.opened ? "text-blue-400 " : ""}
										self-end`}/>
								</div>
								<div className="relative shrink-0">
									<button
										type="button"
										onClick={() =>
											setOpenMenuId(openMenuId === wish.id ? null : wish.id)
										}
										className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6C0B8] bg-[#F2D8CD] text-[#3f2f29] shadow-sm transition hover:bg-[#D6C0B8]"
										aria-label="Open wish actions"
									>
										<MoreVertical size={18} />
									</button>
									{openMenuId === wish.id ? (
										<div className="absolute right-0 top-12 z-10 w-40 overflow-hidden rounded-2xl border border-[#D6C0B8] bg-white shadow-lg">
											<button
												type="button"
												onClick={() => {
													setOpenMenuId(null);
													navigate(`/form/wish/${wish.id}`);
												}}
												className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[#3f2f29] transition hover:bg-[#F2D8CD]"
											>
												<Edit size={16} />
												Update
											</button>
											<button
												type="button"
												onClick={() => {
													setOpenMenuId(null);
													if (
														confirm(
															"Are you sure you want to delete this wish?",
														)
													) {
														deleteWishFn(wish.id);
													}
												}}
												className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[#3f2f29] transition hover:bg-[#F2D8CD]"
											>
												<Trash2 size={16} />
												Delete
											</button>
										</div>
									) : null}
								</div>
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
