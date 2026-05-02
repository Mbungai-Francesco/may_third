import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UserCreateDTO } from '@/types/User'
import { useMutation } from '@tanstack/react-query'
import { loadToast } from '@/lib/loadToast'
import { register } from '@/api/Auth'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'


// ✅ Zod schema
const formSchema = z.object({
  names: z.string().min(1, 'Names are required'),
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(4, 'Password is required'),
})

export const Register = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
	const { setUser } = useAuthStore()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    // Cast to `any` to avoid zod version-type mismatches between resolver and zod typings
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: '',
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const val: UserCreateDTO = {
      ...values,
    }
    console.log(val)
    mutate(val)
  }

  const { mutate } = useMutation({
    mutationFn: (val: UserCreateDTO) => {
      loadToast('Creating account', '', 0, 'blue')
      return register(val)
    },
    onSuccess: (data) => {
      if (data !== null) {
				setUser(data)
        toast.dismiss()
        navigate('/sent')
      } else loadToast('Warning', 'Wrong credentials', 3000, 'red')
    },
    onError: (error) => {
      loadToast('Warning', 'Wrong credentials', 3000, 'red')
      console.error('Error logging in:', error)
    },
  })

  const handlePasswordVisibility = () => {
    setOpen(!open)
  }

  return (
		<div className="bg-blob min-h-screen flex items-center justify-center px-6">
			<div className="petal w-10 h-10 top-[8%] left-[10%] rotate-45 bg-[#D6C0B8]"></div>
			<div className="petal w-6 h-6 top-[15%] right-[12%] -rotate-12 bg-[#F2D8CD]"></div>
			<div className="petal w-8 h-8 bottom-[20%] left-[8%] rotate-12 bg-[#D6C0B8]"></div>
			<div className="petal w-5 h-5 bottom-[12%] right-[15%] rotate-45 bg-[#B38E81]"></div>
			<div className="petal w-12 h-12 top-[35%] right-[5%] -rotate-30 bg-[#F2D8CD]"></div>
			<div className="petal w-7 h-7 top-[60%] left-[5%] rotate-20 bg-[#D6C0B8]"></div>

			<div
				className="card-gradient w-full max-w-md shadow-2xl rounded-[2.5rem] p-6 border border-transparent"
				style={{
					boxShadow:
						"0 20px 60px rgba(179,142,129,0.30), 0 4px 16px rgba(179,142,129,0.15)",
				}}
			>
				<div className="flex flex-col items-center">
					{/* <!-- Subtle inner glow at top --> */}
					<div
						className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 blur-2xl rounded-full pointer-events-none"
						style={{ background: "rgba(242,216,205,0.5)" }}
					></div>

					{/* <!-- Hello beautiful --> */}
					<p className="font-vibes hello-text text-4xl mb-1 leading-tight">
						Daniela's BDay
					</p>

					{/* <!-- Subtitle --> */}
					<p className="font-gara italic text-xl text-neutral-400 leading-relaxed mb-7 px-2">
						Register and leave{" "}
						<span className="font-semibold text-neutral-500">Daniela</span>
						<br />a wish(s) for her birthday! 🎂
					</p>
				</div>

				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							{/* Names */}
							<FormField
								control={form.control}
								name="names"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Names <span className="red-star">*</span>
										</label>
										<FormControl>
											<input
												type="text"
												placeholder="Franc Xaverio"
												{...field}
												className="input-field input input-form"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Email <span className="red-star">*</span>
										</label>
										<FormControl>
											<input
												type="email"
												placeholder="you@example.com"
												{...field}
												className="input-field input input-form"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<label className="text-[#B38E81]">
											Password <span className="red-star">*</span>
										</label>
										<FormControl>
											<div className="relative flex z-0 items-center">
												<input
													placeholder="••••••••"
													{...field}
													className="input-field input input-form"
													type={open ? "text" : "password"}
												/>
												<div className="absolute right-3 flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900">
													{open ? (
														<Eye
															className="float-right"
															onClick={handlePasswordVisibility}
														/>
													) : (
														<EyeOff
															className="float-right"
															onClick={handlePasswordVisibility}
														/>
													)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Button */}
							<button
								type="submit"
								className="btn-gradient auth-button"
								style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
							>
								Register
							</button>
						</form>
					</Form>
				</div>
				<p
					className="font-gara mt-2 text-xl italic"
					style={{ color: "#B38E81" }}
				>
					Already have one?{" "}
					<span
						className="font-gara text-xl font-semibold underline italic cursor-pointer hover:underline"
						style={{ color: "#B38E81" }}
						onClick={() => navigate("/login")}
					>
						Login here
					</span>
					.
				</p>
			</div>
		</div>
	);
}
