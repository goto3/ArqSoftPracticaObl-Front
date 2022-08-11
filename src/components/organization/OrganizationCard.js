import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Divider, Grid, Typography, Button, Avatar, InputAdornment, FormControl, OutlinedInput, Tooltip, InputLabel, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { Copy as CopyIcon, RefreshCw as RefreshIcon } from "react-feather";
import { CopyToClipboard } from "react-copy-to-clipboard";
import InviteDialog from "../invite/inviteDialog";

import SnackbarContext from "../../context/snackbarContext";

import * as apiKeyService from "../../services/apiKeyService";

const OrganizationCard = ({ organization, ...rest }) => {
	const [dialogIsOpen, setDialogOpen] = useState(false);
	const [key, setKey] = useState("Fetching key...");
	const [copiedText, setCopiedText] = useState("");

	const { OrganizationName: orgName, permission, createdAt } = organization;
	const joinDate = moment(createdAt).format("DD/MM/YYYY");

	const { setSnackbar } = useContext(SnackbarContext);

	useEffect(() => {
		(async () => {
			try {
				if (permission === "Administrator") {
					const token = await apiKeyService.getApiKey(orgName);
					if (token) setKey(token.data.token);
				}
			} catch (err) {
				setKey("Error getting key");
			}
		})();
	}, []);

	function handleClickInvite() {
		setDialogOpen(true);
	}

	function handleCloseInvite() {
		setDialogOpen(false);
	}

	async function handleRefreshKey() {
		if (key !== "Refreshing Key...") {
			try {
				setKey("Refreshing Key...");
				const token = await apiKeyService.refreshKey(orgName);
				setTimeout(() => {
					if (token) {
						setKey(token.data.newKey);
						setSnackbar({ open: true, message: "API key refreshed successfully!", severity: "success" });
					}
				}, 150);
			} catch (err) {
				setKey("Error getting key");
			}
		}
	}

	return (
		<>
			<Card
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
				{...rest}>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							pb: 3,
						}}>
						<Avatar alt="Product" src={"/static/images/products/product_2.png"} variant="square" />
					</Box>
					<Typography align="center" color="textPrimary" gutterBottom variant="h4" sx={{ overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>
						{orgName}
					</Typography>
					<Typography align="center" color="textPrimary" variant="body2">
						{permission}
					</Typography>
				</CardContent>
				<Box sx={{ flexGrow: 1 }} />
				{permission === "Administrator" && (
					<>
						<Divider />
						<Box
							sx={{
								p: 1,
								display: "flex",
								alignItems: "center",
							}}>
							<CopyToClipboard text={key} onCopy={() => setCopiedText(key)}>
								<Tooltip title={copiedText === key ? "Copied!" : "Click to copy to clipboard"} placement="top">
									<FormControl fullWidth sx={{ m: 1 }}>
										<InputLabel htmlFor="outlined-adornment-amount">API key</InputLabel>
										<OutlinedInput
											disabled
											id="outlined-adornment-amount"
											value={key}
											startAdornment={
												<InputAdornment position="start">
													<CopyIcon size={18} />
												</InputAdornment>
											}
											label="API key"
											size="small"
											inputProps={{ style: { fontSize: 16 } }}
										/>
									</FormControl>
								</Tooltip>
							</CopyToClipboard>
							<IconButton aria-label="delete" color="primary" onClick={handleRefreshKey}>
								<RefreshIcon />
							</IconButton>
						</Box>
					</>
				)}
				<Divider />
				<Grid container>
					<Grid item xs={6}>
						<Box sx={{ p: 2 }}>
							<Grid
								item
								sx={{
									alignItems: "center",
									display: "flex",
									height: 25,
								}}>
								{permission === "Administrator" && (
									<Button onClick={handleClickInvite} endIcon={<SendIcon />}>
										Invite
									</Button>
								)}
							</Grid>
						</Box>
					</Grid>
					<Grid
						item
						xs={6}
						sx={{
							alignItems: "center",
							display: "flex",
							justifyContent: "flex-end",
							paddingRight: 3,
						}}>
						<Typography textAlign="right" align="center" color="textPrimary" variant="body2">
							Joined {joinDate}
						</Typography>
					</Grid>
				</Grid>
			</Card>
			<InviteDialog onCloseDialog={handleCloseInvite} dialogIsOpen={dialogIsOpen} organization={orgName} />
		</>
	);
};

OrganizationCard.propTypes = {
	organization: PropTypes.object.isRequired,
};

export default OrganizationCard;
