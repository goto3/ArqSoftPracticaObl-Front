import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Books from "./pages/Books";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import Organizations from "./pages/Organizations";
import CreateOrganization from "./pages/CreateOrganization";
import Logout from "./pages/Logout";
import Join from "./pages/Join";
import ServerError from "./pages/ServerError";
import StudentReservations from "./pages/StudentReservations";
import OrgReservations from "./pages/OrgReservations";
import BookReviews from "./pages/BookReviews";

import LoggedInGuard from "./components/guards/loggedIn";

const routes = [
	{
		path: "app",
		element: <DashboardLayout />,
		children: [
			{ path: "invite/:id", element: <Join /> },
			{ path: "login", element: <Login /> },
			{ path: "logout", element: <LoggedInGuard page={Logout} /> },
			{ path: "neworg", element: <CreateOrganization /> },
			{ path: "myreservations", element: <LoggedInGuard page={StudentReservations} permission="Student" /> },
			{ path: "orgreservations", element: <LoggedInGuard page={OrgReservations} permission="Administrator" /> },
			{ path: "books", element: <LoggedInGuard page={Books} /> },
			{ path: "organizations", element: <LoggedInGuard page={Organizations} /> },
			{ path: "books/:bookId/reviews", element: <LoggedInGuard page={BookReviews} /> },
			{ path: "*", element: <Navigate to="/app/404" /> },
			{ path: "404", element: <NotFound /> },
			{ path: "403", element: <Forbidden /> },
			{ path: "500", element: <ServerError /> },
		],
	},
	{
		path: "/",
		children: [
			{ path: "/", element: <Navigate to="/app/login" /> },
			{ path: "*", element: <Navigate to="/app/404" /> },
		],
	},
];

export default routes;
