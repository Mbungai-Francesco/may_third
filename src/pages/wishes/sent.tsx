import { getSentWishes } from '@/api/WishApi';
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query';

export const Sent = () => {
	// const { isAuthenticated, user } = useAuthStore()

	// Fetching values
	const { isPending, data: wishes } = useQuery({
		queryKey: ["wishes"],
		queryFn: getSentWishes,
	});

	return (
		<div className="bg-blob h-screen flex flex-col p-6 overflow-y-scroll">
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
						</div>
					))}
				</div>
			)}

			<button
				type="submit"
				className="btn-gradient auth-button"
				style={{ boxShadow: "0 8px 24px rgba(179,142,129,0.45)" }}
			>
				Click to add A wish
			</button>
		</div>
	);
};;
