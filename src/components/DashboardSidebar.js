import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, Drawer, Hidden, List, Typography, TextField, MenuItem } from "@material-ui/core";
import { LogIn as LogInIcon, ShoppingBag as ShoppingBagIcon, Book as BookIcon, LogOut as LogOutIcon, Layers as NewOrgIcon, Bookmark } from "react-feather";
import NavItem from "./NavItem";
import UserContext from "../context/userContext";

import * as OrgService from "../services/organizationService";

const itemsGuest = [
	{
		href: "/app/neworg",
		icon: NewOrgIcon,
		title: "Create organization",
	},
	{
		href: "/app/login",
		icon: LogInIcon,
		title: "Login",
	},
];

const itemsStudent = [
	{
		href: "/app/books",
		icon: BookIcon,
		title: "Books",
	},
	{
		href: "/app/organizations",
		icon: ShoppingBagIcon,
		title: "My organizations",
	},
	{
		href: "/app/myreservations",
		icon: Bookmark,
		title: "My reservations",
	},
	{
		href: "/app/logout",
		icon: LogOutIcon,
		title: "Logout",
	},
];

const itemsAdministrator = [
	{
		href: "/app/books",
		icon: BookIcon,
		title: "Books",
	},
	{
		href: "/app/organizations",
		icon: ShoppingBagIcon,
		title: "My organizations",
	},
	{
		href: "/app/orgreservations",
		icon: Bookmark,
		title: "Reservations",
	},
	{
		href: "/app/logout",
		icon: LogOutIcon,
		title: "Logout",
	},
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
	const location = useLocation();
	const avatar = "/static/images/avatars/user2.png";

	const { currentUser, selectedOrgIndex, organizations, handleChangeSelectedOrg } = useContext(UserContext);

	const [_menuItems, setMenuItems] = useState(itemsGuest);
	const [_orgs, setOrganizations] = useState([]);
	const [_selected, setSelected] = useState("");

	useEffect(() => {
		if (openMobile && onMobileClose) {
			onMobileClose();
		}
	}, [location.pathname]);

	useEffect(() => {
		if (currentUser && OrgService.getSelectedOrganizationPermission() === "Administrator") setMenuItems(itemsAdministrator);
		else if (currentUser && OrgService.getSelectedOrganizationPermission() === "Student") setMenuItems(itemsStudent);
		else setMenuItems(itemsGuest);
	}, [currentUser]);

	useEffect(() => {
		if (organizations) {
			const orgs = [];
			let i = 0;
			organizations.forEach((o) => orgs.push({ value: i++, label: o.OrganizationName }));
			setOrganizations(orgs);
		}
	}, [organizations]);

	useEffect(() => {
		selectedOrgIndex ? setSelected(selectedOrgIndex) : setSelected(0);
	}, [selectedOrgIndex]);

	function handleOrgChange(event, child) {
		setSelected(child.props.value);
		handleChangeSelectedOrg(child.props.value);
		if (OrgService.getSelectedOrganizationPermission() === "Administrator") setMenuItems(itemsAdministrator);
		else if (OrgService.getSelectedOrganizationPermission() === "Student") setMenuItems(itemsStudent);
	}

	const content = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					p: 2,
				}}>
				<Avatar
					src={avatar}
					sx={{
						cursor: "pointer",
						width: 64,
						height: 64,
					}}
				/>
				<Typography noWrap color="textPrimary" variant="h5" sx={{ overflow: "hidden", textOverflow: "ellipsis", width: "13rem", textAlign: "center" }}>
					Welcome {currentUser ? currentUser.name : "Guest"}!
				</Typography>

				<Typography color="textSecondary" variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", width: "13rem", textAlign: "center" }}>
					{currentUser ? currentUser.email : ""}
				</Typography>

				{currentUser && (
					<TextField
						sx={{
							mt: 3,
						}}
						fullWidth
						id="outlined-select-currency"
						select
						label="Organization"
						value={_selected}
						onChange={handleOrgChange}>
						{_orgs.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				)}
			</Box>
			<Divider />
			<Box sx={{ p: 2 }}>
				<List>
					{_menuItems.map((item) => (
						<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
					))}
				</List>
			</Box>
		</Box>
	);

	return (
		<>
			<Hidden lgUp>
				<Drawer
					anchor="left"
					onClose={onMobileClose}
					open={openMobile}
					variant="temporary"
					PaperProps={{
						sx: {
							width: 256,
						},
					}}>
					{content}
				</Drawer>
			</Hidden>
			<Hidden xlDown>
				<Drawer
					anchor="left"
					open
					variant="persistent"
					PaperProps={{
						sx: {
							width: 256,
							top: 64,
							height: "calc(100% - 64px)",
						},
					}}>
					{content}
				</Drawer>
			</Hidden>
		</>
	);
};

DashboardSidebar.propTypes = {
	onMobileClose: PropTypes.func,
	openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
	onMobileClose: () => {},
	openMobile: false,
};

export default DashboardSidebar;
