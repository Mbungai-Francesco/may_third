import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loadToast } from "@/lib/loadToast";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import type { WishUpdateDTO } from "@/types";
import { getWishById, updateWish } from "@/api/WishApi";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// ✅ Zod schema for update
const formSchema = z.object({
	title: z.string().min(2, "Title is required").max(100, "Title is too long"),
	content: z
		.string()
		.min(10, "Content is required")
		.max(1000, "Content is too long"),
  town: z.string().max(100, "Town name is too long").optional(),
});

export default function WishUpdateForm() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuthStore();

	useEffect(() => {
		if (!isAuthenticated) navigate("/login");
	}, [isAuthenticated, navigate]);

	// Fetch the wish data
	const { data: wish, isLoading, error } = useQuery({
		queryKey: ["wish", id],
		queryFn: () => getWishById(id || "", user?.jwt || ""),
		enabled: !!id && !!user?.jwt,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
			town: "",
		},
	});

	// Update form values when wish data is loaded
	useEffect(() => {
		if (wish) {
			form.reset({
				title: wish.title,
				content: wish.content,
        town: wish.town || "",
			});
		}
	}, [wish, form]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		const updateData: WishUpdateDTO = {
			title: values.title,
			content: values.content,
      town: values.town,
		};

    // console.log(updateData);
    

		mutate(updateData);
	}

	const { mutate } = useMutation({
		mutationFn: (val: WishUpdateDTO) => {
			loadToast("Updating wish", "", 0, "blue");
			return updateWish(id || "", val, user?.jwt || "");
		},
		onSuccess: (data) => {
			if (data !== null) {
				toast.dismiss();
				toast.success("Wish updated successfully!");
				navigate(-1); // Go back to previous page
			} else {
				loadToast("Warning", "Error updating wish", 3000, "red");
			}
		},
		onError: (error) => {
			loadToast("Warning", "Error updating wish", 3000, "red");
			console.error("Error updating wish:", error);
		},
	});

	if (isLoading) {
		return (
			<div className="bg-blob min-h-screen flex items-center justify-center">
				<p className="text-neutral-600">Loading wish...</p>
			</div>
		);
	}

	if (error || !wish) {
		return (
			<div className="bg-blob min-h-screen flex items-center justify-center">
				<p className="text-red-500">Error loading wish. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="bg-blob min-h-screen flex items-center justify-center px-4">
			<div
				className="card-gradient w-full max-w-md shadow-2xl rounded-[2.5rem] px-4 py-4 pb-8 border border-transparent"
				style={{
					boxShadow:
						"0 20px 60px rgba(179,142,129,0.30), 0 4px 16px rgba(179,142,129,0.15)",
				}}
			>
				<div
					className="flex items-center justify-end"
					onClick={() => navigate(-1)}
				>
					<X />
				</div>
				<div className="mb-4 flex items-center gap-3">
					<p className="font-gara italic text-xl text-neutral-700 leading-relaxed px-2 font-semibold">
						Update your wish ✨
					</p>
				</div>

				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							{/* Title */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Title <span className="red-star">*</span>{" "}
										</label>
										<FormControl>
											<input
												type="text"
												placeholder="Enter wish title"
												{...field}
												className="input-field input-wish"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Content */}
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Content <span className="red-star">*</span>
										</label>
										<FormControl>
											<div className="relative flex z-0 items-center">
												<textarea
													placeholder="Enter wish content"
													{...field}
													className="input-field input-wish text-xl"
													rows={5}
												></textarea>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Town */}
							<FormField
								control={form.control}
								name="town"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Town <span className="red-star">*</span>
										</label>
										<FormControl>
											<input
												type="text"
												placeholder="Enter town name"
												{...field}
												className="input-field input-wish"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Button */}
							<button
								type="submit"
								className="btn-gradient auth-button font-semibold font-poppins"
								style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
							>
								Update
							</button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
