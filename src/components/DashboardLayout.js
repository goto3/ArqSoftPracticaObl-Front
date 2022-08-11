import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { styled } from "@material-ui/core/styles";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import GlobalSnackbar from "../components/misc/GlobalSnackbar/GlobalSnackbar";
import Axios from "axios";

import UserContext from "../context/userContext";
import SnackbarContext from "../context/snackbarContext";

import * as Auth from "../services/authService";
import * as OrganizationService from "../services/organizationService";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	display: "flex",
	height: "100%",
	overflow: "hidden",
	width: "100%",
}));

const DashboardLayoutWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flex: "1 1 auto",
	overflow: "hidden",
	paddingTop: 64,
	[theme.breakpoints.up("lg")]: {
		paddingLeft: 256,
	},
}));

const DashboardLayoutContainer = styled("div")({
	display: "flex",
	flex: "1 1 auto",
	overflow: "hidden",
});

const DashboardLayoutContent = styled("div")({
	flex: "1 1 auto",
	height: "100%",
	overflow: "auto",
});

const DashboardLayout = () => {
	const navigate = useNavigate();
	const [isMobileNavOpen, setMobileNavOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [organizations, setOrganizations] = useState(null);
	const [selectedOrgIndex, setSelectedOrg] = useState(null);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
	const [token, setToken] = useState("");

	useEffect(() => {
		(async () => {
			// Each page refresh
			// Set current user from token payload in local storage
			const user = Auth.getCurrentUser();
			setCurrentUser(user);

			if (user) {
				//Set user organizations
				const userOrganizations = await OrganizationService.getUserOrganizations();
				setOrganizations(userOrganizations);

				// Set selected org from local storage
				const selectedOrgIndex = OrganizationService.getSelectedOrganizationIndex();
				setSelectedOrg(selectedOrgIndex);
			}
		})();
	}, [token]);

	const handleLoginLogout = async () => {
		setToken(Auth.getToken());
	};

	const handleChangeSelectedOrg = (index) => {
		OrganizationService.setSelectedOrganization(index);
		setSelectedOrg(index);
	};

	Axios.interceptors.response.use(null, (error) => {
		if (error.response.status === 403) {
			console.log(error);
			setCurrentUser(null);
			Auth.logout();
			navigate("/app/403", { replace: true });
		}
		if (error.response.status === 404) navigate("/app/404", { replace: true });
		const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
		if (!expectedError) navigate("/app/500", { replace: true });
		return Promise.reject(error);
	});

	return (
		<DashboardLayoutRoot>
			<SnackbarContext.Provider value={{ setSnackbar }}>
				<UserContext.Provider value={{ currentUser, handleLoginLogout, selectedOrgIndex, handleChangeSelectedOrg, organizations }}>
					<DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
					<DashboardSidebar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
					<DashboardLayoutWrapper>
						<DashboardLayoutContainer>
							<DashboardLayoutContent>
								<Outlet />
							</DashboardLayoutContent>
						</DashboardLayoutContainer>
					</DashboardLayoutWrapper>
					<GlobalSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
				</UserContext.Provider>
			</SnackbarContext.Provider>
		</DashboardLayoutRoot>
	);
};

export default DashboardLayout;
