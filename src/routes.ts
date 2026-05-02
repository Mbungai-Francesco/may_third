import { createBrowserRouter } from "react-router";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages";
import { Unlock } from "./pages/unlock";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { Sent } from "./pages/wishes/sent";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Home,
	},
	{
		path: "/unlock",
		Component: Unlock,
	},
	{
		path: "/login",
		Component: Login,
	},
	{
		path: "/register",
		Component: Register,
	},
  {
		path: "/sent",
		Component: Sent,
	},
	{
		path: "*",
		Component: NotFound,
	},
]);
