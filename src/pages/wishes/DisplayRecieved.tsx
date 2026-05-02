import { getWishById, updateWish } from "@/api/WishApi";
import { useAuthStore } from "@/store/authStore";
import type { WishUpdateDTO } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function DisplayRecieved() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuthStore();

	const message = encodeURIComponent("Hello! I saw your wish 🎉");

	useEffect(() => {
		if (!isAuthenticated) navigate("/unlock");
	}, [isAuthenticated, navigate]);

	const { mutate } = useMutation({
		mutationFn: (val: WishUpdateDTO) => {
			return updateWish(id || "", val, user?.jwt || "");
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const {
		data: wish,
		isPending,
		error,
	} = useQuery({
		queryKey: ["wish", id],
		queryFn: () => getWishById(id || "", user?.jwt || ""),
		enabled: !!id && !!user?.jwt,
	});

	useEffect(() => {
		if (wish && !wish.opened) {
			mutate({ ...wish, opened: true });
		}
	}, [wish, mutate]);

	if (isPending) {
		return (
			<div className="bg-blob min-h-screen flex items-center justify-center px-4">
				<p className="text-neutral-700">Loading wish...</p>
			</div>
		);
	}

	if (error || !wish) {
		return (
			<div className="bg-blob min-h-screen flex items-center justify-center px-4">
				<p className="text-[#B38E81]">Wish not found.</p>
			</div>
		);
	}

	return (
		<div className="bg-blob min-h-screen flex flex-col items-center justify-center px-4 py-6 relative">
			{wish.user?.phone && (
				<a
					href={`https://wa.me/${wish.user?.phone?.replace(/\D/g, "")}?text=${message}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 text-green-600 absolute bottom-8 right-5 animate-bounce"
				>
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
						className="w-20 h-20"
					/>
				</a>
			)}
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6C0B8] bg-[#F2D8CD] text-[#3f2f29] transition hover:bg-[#D6C0B8] self-end shadow-4xl"
				aria-label="Close wish"
			>
				<X size={18} />
			</button>
			<div className="mb-4 w-full flex items-start justify-between gap-4">
				<div>
					<h1 className="mt-1 text-3xl font-bold text-[#3f2f29]">
						{wish.title}
					</h1>
					{wish.user && (
						<p className="text-lg leading-8">
							From :{" "}
							<span className="text-black/70">
								{" "}
								{wish.user.names.split(" ")[0]}
							</span>
						</p>
					)}
					{wish.town && (
						<p className="text-lg leading-8">
							at : <span className="text-black/70"> {wish.town}</span>
						</p>
					)}
				</div>
			</div>

			<div className="space-y-5 text-[#3f2f29]">
				{/* <p>From : </p> */}
				<p className="text-lg leading-8">{wish.content}</p>
			</div>
		</div>
	);
}
