import { logout } from "@/api/Auth";
import { getMyWishes, reactToWish } from "@/api/WishApi";
import { loadToast } from "@/lib/loadToast";
// import { CheckLogin } from '@/lib/checkLogin';
import { useAuthStore } from "@/store/authStore";
import { Reaction } from "@/types";
import type { ReactDTO } from "@/types/Wish";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, RefreshCw, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const Received = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { isAuthenticated, user, setUser } = useAuthStore();
	const [selectedName, setSelectedName] = useState("all");
	const [selectedTown, setSelectedTown] = useState("all");

	// CheckLogin(isAuthenticated, navigate)
	useEffect(() => {
		if (!isAuthenticated) navigate("/login");
		queryClient.invalidateQueries({ queryKey: ["wishes"] });
	}, [isAuthenticated, navigate, queryClient]);

	// Fetching values
	const { isPending, data: wishes } = useQuery({
		queryKey: ["wishes"],
		queryFn: () => getMyWishes(user?.jwt || ""),
	});

	const filteredWishes = useMemo(() => {
		return (wishes ?? []).filter((wish) => {
			const wishName = wish.user?.names || "";
			const wishTown = wish.town || "";

			const matchesName =
				selectedName === "all" || wishName === selectedName;
			const matchesTown =
				selectedTown === "all" || wishTown === selectedTown;

			return matchesName && matchesTown;
		});
	}, [selectedName, selectedTown, wishes]);

	const wishNames = useMemo(() => {
		return Array.from(
			new Set((wishes ?? []).map((wish) => wish.user?.names).filter(Boolean)),
		) as string[];
	}, [wishes]);

	const wishTowns = useMemo(() => {
		return Array.from(
			new Set((wishes ?? []).map((wish) => wish.town).filter(Boolean)),
		) as string[];
	}, [wishes]);

	const { mutate: react } = useMutation({
		mutationFn: (val: ReactDTO) => {
			return reactToWish(val.id, val.reaction, user?.jwt || "");
		},
		onSuccess: (data) => {
			if (data !== null) {
				queryClient.invalidateQueries({ queryKey: ["wishes"] });
				toast.dismiss();
				toast.success("Wish reacted to successfully!");
				navigate(-1); // Go back to previous page
			} else {
				loadToast("Warning", "Error reacting to wish", 3000, "red");
			}
		},
		onError: (error) => {
			loadToast("Warning", "Error reacting to wish", 3000, "red");
			console.error("Error reacting to wish:", error);
		},
	});

	const renderReactionButton = (
		wishId: string,
		reaction: Reaction,
		label: string,
		Icon: typeof ThumbsDown,
		activeClassName: string,
	) => {
		const isSelected =
			wishes?.find((wish) => wish.id === wishId)?.reaction === reaction;

		return (
			<button
				type="button"
				onClick={() => react({ id: wishId, reaction } as ReactDTO)}
				className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
					isSelected
						? activeClassName
						: "border-[#D6C0B8] bg-white text-[#3f2f29] hover:bg-[#F2D8CD]"
				}`}
			>
				<Icon
					size={16}
					className={`
						${label === "Love" && isSelected ? "text-red-500" : ""}
						${label === "Like" && isSelected ? "text-blue-500" : ""}`}
				/>
				{label}
			</button>
		);
	};

	return (
		<div
			className="bg-blob h-screen flex flex-col p-6 gap-2"
			style={{ maxHeight: "100dvh" }}
		>
			<div className="flex justify-between items-center">
				<p className="font-gara font-semibold italic text-2xl text-neutral-700 leading-relaxed px-2">
					Hey <span className="font-bold text-black">Daniela!</span>
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
								navigate("/unlock");
							});
						}}
					>
						<X />
					</div>
				</div>
			</div>

			<div className="rounded-3xl border border-[#D6C0B8] bg-white/80 p-4 shadow-sm">
				<div className="mb-3 flex items-center justify-between">
					<p className="font-gara text-xl font-bold italic text-[#3f2f29]">Filters</p>
					<button
						type="button"
						onClick={() => {
							setSelectedName("all");
							setSelectedTown("all");
						}}
						className="rounded-full border border-[#D6C0B8] bg-[#F2D8CD] px-3 py-1 text-sm text-[#3f2f29] transition hover:bg-[#D6C0B8]"
					>
						Reset
					</button>
				</div>
				<div className="flex justify-between items-center gap-3">
					<label className=" w-full flex flex-col gap-2 text-sm text-[#3f2f29]">
						<select
							value={selectedName}
							onChange={(event) => setSelectedName(event.target.value)}
							className="rounded-2xl border border-[#D6C0B8] bg-white px-4 py-3 text-[#3f2f29] outline-none transition focus:border-[#B38E81]"
						>
							<option value="all">All names</option>
							{wishNames.map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</label>

					<label className="w-full flex flex-col gap-2 text-sm text-[#3f2f29]">
						<select
							value={selectedTown}
							onChange={(event) => setSelectedTown(event.target.value)}
							className="rounded-2xl border border-[#D6C0B8] bg-white px-4 py-3 text-[#3f2f29] outline-none transition focus:border-[#B38E81]"
						>
							<option value="all">All towns</option>
							{wishTowns.map((town) => (
								<option key={town} value={town}>
									{town}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>

			<div
				className="box-scroll grow overflow-y-scroll"
			>
				{isPending ? (
					<p>Loading wishes...</p>
				) : (
					<div>
						{filteredWishes.map((wish) => (
							<div
								key={wish.id}
								className="bg-white rounded-lg shadow-md p-4 mb-4"
							>
								<div
									className="cursor-pointer "
									onClick={() => navigate(`/received/${wish.id}`)}
								>
									<h3 className="font-bold text-lg">{wish.title}</h3>
									<p className="text-gray-600">{wish.content}</p>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									{renderReactionButton(
										wish.id,
										Reaction.DISLIKE,
										"Dislike",
										ThumbsDown,
										"border-[#B38E81] bg-[#B38E81] text-white hover:bg-[#B38E81]",
									)}
									{renderReactionButton(
										wish.id,
										Reaction.LIKE,
										"Like",
										ThumbsUp,
										"border-[#D6C0B8] bg-[#D6C0B8] text-[#3f2f29] hover:bg-[#D6C0B8]",
									)}
									{renderReactionButton(
										wish.id,
										Reaction.LOVE,
										"Love",
										Heart,
										"border-[#F2D8CD] bg-[#F2D8CD] text-[#3f2f29] hover:bg-[#F2D8CD]",
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
