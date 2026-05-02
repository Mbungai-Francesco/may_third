import { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole, type LoginDTO } from '@/types/User'
import { useMutation } from '@tanstack/react-query'
import { loadToast } from '@/lib/loadToast'
import { login } from '@/api/Auth'
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
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(4, 'Password is required'),
})

export const Login = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
	const { setUser, isAuthenticated, user } = useAuthStore();

	
		// CheckLogin(isAuthenticated, navigate)
		useEffect(() => {
			if (isAuthenticated){
				if(user?.role === UserRole.CELEBRANT) navigate("/received");
				else navigate("/sent");
			}
		}, [isAuthenticated]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    // Cast to `any` to avoid zod version-type mismatches between resolver and zod typings
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const val: LoginDTO = {
      ...values,
    }
    // console.log(val)
    mutate(val)
  }

  const { mutate } = useMutation({
    mutationFn: (val: LoginDTO) => {
      loadToast('Logging in', '', 0, 'blue')
      return login(val)
    },
    onSuccess: (data) => {
      if (data !== null) {
				// console.log(data);
				
        setUser(data)
        toast.dismiss()
				// console.log(data.role === UserRole.CELEBRANT);
				
				if (data.role === UserRole.CELEBRANT) navigate("/received");
				else navigate("/sent");
      } 
      else loadToast('Warning', 'Wrong credentials', 3000, 'red')
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
			<div
				className="card-gradient w-full max-w-md shadow-2xl rounded-[2.5rem] p-6 border border-transparent"
				style={{
					boxShadow:
						"0 20px 60px rgba(179,142,129,0.30), 0 4px 16px rgba(179,142,129,0.15)",
				}}
			>
				<div className="mb-4">
					<div className="font-gara text-2xl font-bold text-center text-[#B38E81]">
						Welcome Back
					</div>
					<p className="text-center text-sm font-semibold text-gray-600">
						Login to your account
					</p>
				</div>

				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
												className="input-field input input-form text-xl"
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
													className="input-field input input-form text-xl"
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
								Login
							</button>
						</form>
					</Form>
				</div>

				<p
					className="font-gara mt-2 text-xl italic"
					style={{ color: "#B38E81" }}
				>
					No account?{" "}
					<span
						className="font-gara text-xl font-semibold underline italic cursor-pointer hover:underline"
						style={{ color: "#B38E81" }}
						onClick={() => navigate("/register")}
					>
						Register here
					</span>
					.
				</p>
			</div>
		</div>
	);
}
