import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Search as SearchIcon, Calendar as CalendarIcon } from "react-feather";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";

import BookContext from "./../../context/bookContext";
import UserContext from "./../../context/userContext";

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
		paddingTop: 6,
		flexGrow: 1,
	},
}));

const BooksToolbar = (props) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const [orgPermission, setOrgPermission] = useState("");

	const { selectedOrgIndex } = useContext(UserContext);
	const { handleSearchQueryChange, handleAddBook, handleDeleteBook, handleEditBook, handleRentBook, selectedBook } = useContext(BookContext);

	useEffect(() => {
		const org = OrganizationService.getSelectedOrganizationData();
		setOrgPermission(org.permission);
	}, [selectedOrgIndex]);

	function onSearchChanged(event) {
		handleSearchQueryChange(event.target.value);
	}

	function onViewReviews(event) {
		navigate(`/app/books/${selectedBook}/reviews`, { replace: true });
	}

	return (
		<Box {...props}>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<div className={classes.root}>
							<div className={classes.container}>
								<div className={classes.itemFlexGrow}>
									<TextField
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<SvgIcon fontSize="small" color="action">
														<SearchIcon />
													</SvgIcon>
												</InputAdornment>
											),
										}}
										placeholder="Search books"
										variant="outlined"
										onChange={onSearchChanged}
									/>
								</div>
								<div className={classes.item}>
									{orgPermission === "Administrator" ? (
										<>
											<Button sx={{ mx: 1 }} variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddBook}>
												Add
											</Button>
											<Button sx={{ mx: 1 }} disabled={selectedBook === ""} variant="contained" color="warning" startIcon={<EditIcon />} onClick={handleEditBook}>
												Edit
											</Button>
											<Button sx={{ mx: 1 }} disabled={selectedBook === ""} variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteBook}>
												Delete
											</Button>
										</>
									) : (
										<Button sx={{ mx: 1 }} disabled={selectedBook === ""} color="primary" variant="contained" startIcon={<CalendarIcon />} onClick={handleRentBook}>
											Create reservation
										</Button>
									)}
									<Button sx={{ mx: 1 }} disabled={selectedBook === ""} color="primary" variant="contained" startIcon={<CalendarIcon />} onClick={onViewReviews}>
										View reviews
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default BooksToolbar;
