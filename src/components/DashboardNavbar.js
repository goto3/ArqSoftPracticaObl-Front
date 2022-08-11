import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Box, Hidden, IconButton, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";
import Logo from "./Logo";
import UserContext from "../context/userContext";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
	const userContext = useContext(UserContext);

	return (
		<AppBar elevation={0} {...rest}>
			<Toolbar>
				<RouterLink to={userContext.currentUser ? "/app/books" : "/app/newOrg"}>
					<Logo />
				</RouterLink>
				<Box sx={{ flexGrow: 1 }} />
				<Hidden xlDown>
					{userContext.currentUser && (
						<IconButton color="inherit" size="large" component={RouterLink} to="/app/logout">
							<InputIcon />
						</IconButton>
					)}
				</Hidden>
				<Hidden lgUp>
					<IconButton color="inherit" onClick={onMobileNavOpen} size="large">
						<MenuIcon />
					</IconButton>
				</Hidden>
			</Toolbar>
		</AppBar>
	);
};

DashboardNavbar.propTypes = {
	onMobileNavOpen: PropTypes.func,
};

export default DashboardNavbar;
