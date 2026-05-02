import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loadToast } from "@/lib/loadToast";
import { toast } from "sonner";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router";
import type { UserUpdateDTO, WishCreateDTO } from "@/types";
import { createWish } from "@/api/WishApi";
import { X } from "lucide-react";
import { updateUser } from "@/api/UserApi";
import { useAuthStore } from "@/store/authStore";
// import { CheckLogin } from "@/lib/checkLogin";
import { useEffect } from "react";

// ✅ Zod schema
const formSchema = z.object({
	title: z.string().min(2, "Title is required").max(100, "Title is too long"),
	content: z
		.string()
		.min(10, "Content is required")
		.max(1000, "Content is too long"),
	town: z.string().max(100, "Town name is too long").optional(),
	phone: z.string().max(20, "Phone number is too long").optional(),
});

export default function WishForm() {
	const { isAuthenticated, user } = useAuthStore();
	const navigate = useNavigate();

	// CheckLogin(isAuthenticated, navigate)
	useEffect(() => {
		if (!isAuthenticated) navigate("/login");
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
			town: user?.town || undefined,
			phone: user?.phone || undefined,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		const val: WishCreateDTO = {
			...values,
			date: new Date(),
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			friendId: "550e8400-e29b-41d4-a716-446655440000",
		};
		console.log(val);
		if (values.town || values.phone) {
			updateUserFn({
				town: values.town,
				phone: values.phone,
			});
		}
		mutate(val);
	}

	const { mutate } = useMutation({
		mutationFn: (val: WishCreateDTO) => {
			loadToast("Creating wish", "", 0, "blue");
			return createWish(val);
		},
		onSuccess: (data) => {
			if (data !== null) {
				toast.dismiss();
				navigate("/sent");
			} else loadToast("Warning", "Error creating wish", 3000, "red");
		},
		onError: (error) => {
			loadToast("Warning", "Error creating wish", 3000, "red");
			console.error("Error creating wish:", error);
		},
	});

	const { mutate: updateUserFn } = useMutation({
		mutationFn: (val: UserUpdateDTO) => {
			return updateUser(user?.id || "", val);
		},
		onSuccess: (data) => {
			// toast.dismiss();
			// navigate("/sent");
			if (data === null) loadToast("Warning", "Error updating", 3000, "red");
		},
		onError: (error) => {
			loadToast("Warning", "Error updating", 3000, "red");
			console.error("Error updating:", error);
			// navigate("/sent");
		},
	});

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
					onClick={() => navigate("/sent")}
				>
					<X />
				</div>
				<div className="mb-4 flex items-center gap-3">
					<p className="font-gara italic text-xl text-neutral-700 leading-relaxed px-2 font-semibold">
						Just let the words flow like water 😊
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
													id=""
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

							<div className="flex justify-between gap-3">
								<FormField
									control={form.control}
									name="town"
									render={({ field }) => (
										<FormItem>
											<label className="text-[#B38E81]">Town</label>
											<FormControl>
												<input
													type="text"
													placeholder="Enter your town"
													{...field}
													className="input-field input-wish placeholder-neutral-400"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<label className="text-[#B38E81]">
												<div className="flex items-center">
													<img
														src="/WhatsApp.svg"
														alt="WhatsApp"
														className="w-6"
													/>
													<p>Number</p>
												</div>
											</label>
											<FormControl>
												<input
													type="tel"
													placeholder="+1234567890"
													{...field}
													className="input-field input-wish font-poppins text-base placeholder-neutral-300"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<p
								className="font-gara mt-2 text-xl italic"
								style={{ color: "#B38E81" }}
							>
								<span className="text-black">*</span>
								Maybe add your number So she can say Thanks.
							</p>

							{/* Button */}
							<button
								type="submit"
								className="btn-gradient auth-button font-semibold font-poppins"
								style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
							>
								Send
							</button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
