import React, { useEffect, useContext } from "react";
import { Button, Dialog, TextField, Box, Typography, DialogActions } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";

import SnackbarContext from "../../context/snackbarContext";

import * as ReviewService from "../../services/reviewService";

const AddReviewDialog = ({ dialogIsOpen, onCloseDialog, bookId }) => {
	const { setSnackbar } = useContext(SnackbarContext);

	useEffect(() => {
		formik.resetForm();
	}, [dialogIsOpen]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			await ReviewService.postReview(bookId, values);
			onCloseDialog(null, true);
			formik.resetForm();
			setSnackbar({ open: true, message: `Review for book ${bookId} created successfully!`, severity: "success" });
		} catch (err) {
			if (err.response && err.response.status === 404) {
				onCloseDialog(null, true);
				setSnackbar({ open: true, message: `Can not find book ${bookId}.`, severity: "error" });
			}
			if (err.response && err.response.status === 400) {
				switch (err.response.data.code) {
					case "review.duplicate":
						setSnackbar({ open: true, message: `You already have a review for this book.`, severity: "error" });
						onCloseDialog(null, true);
						break;
					default:
				}
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			rating: "",
			review: "",
		},
		validationSchema: yup.object().shape({
			rating: yup.number().min(1).max(5).required("Value between 1 and 5 is required"),
			review: yup.string().max(255).required("Field required"),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<Dialog open={dialogIsOpen} onClose={onCloseDialog}>
			<form onSubmit={formik.handleSubmit}>
				<Box sx={{ mb: 2, pt: 4, pl: 5 }}>
					<Typography color="textPrimary" variant="h2">
						Create new review
					</Typography>
					<Typography color="textSecondary" gutterBottom variant="body2">
						For book {bookId}
					</Typography>
				</Box>
				<Box sx={{ mb: 2, pl: 4, pr: 4 }}>
					<TextField
						error={Boolean(formik.touched.rating && formik.errors.rating)}
						fullWidth
						helperText={formik.touched.rating && formik.errors.rating}
						label="Rating [1..5]"
						margin="normal"
						name="rating"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.rating}
						variant="outlined"
						inputProps={{ maxLength: 1 }}
						type="number"
					/>
					<TextField
						error={Boolean(formik.touched.review && formik.errors.review)}
						fullWidth
						helperText={formik.touched.review && formik.errors.review}
						label="Review"
						margin="normal"
						name="review"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.review}
						variant="outlined"
						inputProps={{ maxLength: 255 }}
					/>
				</Box>

				<DialogActions sx={{ p: 4 }}>
					<Button onClick={onCloseDialog}>Cancel</Button>
					<Button variant="contained" type="submit" disabled={formik.isSubmitting}>
						Add review
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddReviewDialog;
