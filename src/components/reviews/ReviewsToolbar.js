import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Card, CardContent, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import BookReviewContext from "../../context/bookReviewContext";
import UserContext from "../../context/userContext";

import * as OrganizationService from "../../services/organizationService";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
	},
	item: {
		paddingLeft: 15,
		paddingTop: 16,
	},
	itemFlexGrow: {
		paddingTop: 8,
		paddingLeft: 10,
		flexGrow: 1,
	},
}));

const ReviewsToolbar = (props) => {
	const classes = useStyles();

	const [orgPermission, setOrgPermission] = useState("");

	useEffect(() => {
		const permission = OrganizationService.getSelectedOrganizationPermission();
		setOrgPermission(permission);
	}, []);

	const { currentUser } = useContext(UserContext);
	const { handleAddReview, setPage, handleDeleteReview, selectedReviewData, setOwnReview } = useContext(BookReviewContext);

	function canDelete() {
		return !(selectedReviewData && currentUser.email === selectedReviewData.owner);
	}

	function onOwnChange(event) {
		setOwnReview(event.target.checked);
		setPage(0);
	}

	return (
		<Box {...props}>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<div className={classes.root}>
							<div className={classes.container}>
								<div className={classes.itemFlexGrow}>
									<FormControlLabel onChange={onOwnChange} control={<Checkbox />} label="Own review" />
								</div>
								<div className={classes.item}>
									{orgPermission === "Student" && (
										<>
											<Button sx={{ mx: 1 }} variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddReview}>
												Add
											</Button>
											<Button sx={{ mx: 1 }} disabled={canDelete()} variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteReview}>
												Delete
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default ReviewsToolbar;
