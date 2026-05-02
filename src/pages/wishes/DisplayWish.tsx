import { deleteWish, getWishById } from "@/api/WishApi";
import { loadToast } from "@/lib/loadToast";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function DisplaySentWish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const {
    data: wish,
    isPending,
    error,
  } = useQuery({
    queryKey: ["wish", id],
    queryFn: () => getWishById(id || "", user?.jwt || ""),
    enabled: !!id && !!user?.jwt,
  });

  const { mutate: deleteWishFn } = useMutation({
    mutationFn: () => {
      loadToast("Deleting wish", "", 0, "blue");
      return deleteWish(id || "", user?.jwt || "");
    },
    onSuccess: (data) => {
      if (data) {
        toast.dismiss();
        toast.success("Wish deleted successfully!");
        navigate("/sent");
      } else {
        loadToast("Warning", "Error deleting wish", 3000, "red");
      }
    },
    onError: (mutationError) => {
      loadToast("Warning", "Error deleting wish", 3000, "red");
      console.error("Error deleting wish:", mutationError);
    },
  });

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
		<div className="bg-blob min-h-screen flex flex-col items-center justify-center px-4 py-6">
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6C0B8] bg-[#F2D8CD] text-[#3f2f29] transition hover:bg-[#D6C0B8] self-end shadow-4xl"
				aria-label="Close wish"
			>
				<X size={18} />
			</button>
			<div className="mb-4 flex items-start justify-between gap-4">
				<div>
					<h1 className="mt-1 text-3xl font-bold text-[#3f2f29]">
						{wish.title}
					</h1>
				</div>
			</div>

			<div className="space-y-5 text-[#3f2f29]">
        {/* <p>From : </p> */}
				<p className="text-lg leading-8">{wish.town}</p>
				<p className="text-lg leading-8">{wish.content}</p>

				<div className="flex flex-wrap gap-3 pt-2">
					<button
						type="button"
						onClick={() => navigate(`/form/wish/${wish.id}`)}
						className="flex items-center gap-2 rounded-full border border-[#B38E81] bg-[#B38E81] px-4 py-3 text-white shadow-sm transition hover:bg-[#D6C0B8] hover:text-[#3f2f29]"
					>
						<Edit size={18} />
						Update
					</button>
					<button
						type="button"
						onClick={() => {
							if (confirm("Are you sure you want to delete this wish?")) {
								deleteWishFn();
							}
						}}
						className="flex items-center gap-2 rounded-full border border-[#D6C0B8] bg-[#F2D8CD] px-4 py-3 text-[#3f2f29] shadow-sm transition hover:bg-[#D6C0B8]"
					>
						<Trash2 size={18} />
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
