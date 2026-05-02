import { createBrowserRouter } from "react-router";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages";
import { Unlock } from "./pages/unlock";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { Sent } from "./pages/wishes/sent";
import WishForm from "./pages/forms/WishForm";
import WishUpdateForm from "./pages/forms/WishUpdateForm";
import DisplaySentWish from "./pages/wishes/DisplayWish";
import { Received } from "./pages/wishes/received";
import DisplayRecieved from "./pages/wishes/DisplayRecieved";

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
		path: "/received",
		Component: Received,
	},
	{
		path: "/form/wish",
		Component: WishForm,
	},
	{
		path: "/form/wish/:id",
		Component: WishUpdateForm,
	},
	{
		path: "/wish/:id",
		Component: DisplaySentWish,
	}
	,
	{
		path: "/received/:id",
		Component: DisplayRecieved,
	},
	{
		path: "*",
		Component: NotFound,
	},
]);
