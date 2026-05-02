import { RouterProvider } from "react-router/dom";
import { router } from "./routes";
import './styles.css'
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

function App() {
	const fetchUser = useAuthStore((state) => state.fetchUser)

	useEffect(() => {
	  fetchUser()
	}, )

	return (
		<>
			<title>My App</title>
			<RouterProvider router={router} />
		</>
	);
}

export default App
