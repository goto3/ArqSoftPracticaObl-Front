import React, { useEffect, useContext } from "react";
import { Button, Dialog, TextField, Box, Typography, DialogActions } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";

import SnackbarContext from "../../context/snackbarContext";

import * as BookService from "../../services/bookService";

const EditBookDialog = ({ dialogIsOpen, onCloseDialog, selectedBookData }) => {
	const { setSnackbar } = useContext(SnackbarContext);

	useEffect(() => {
		(async () => {
			if (dialogIsOpen) {
				try {
					formik.setFieldValue("isbn", selectedBookData.isbn);
					formik.setFieldValue("title", selectedBookData.title);
					formik.setFieldValue("authors", selectedBookData.authors);
					formik.setFieldValue("year", selectedBookData.year);
					formik.setFieldValue("copiesAmount", selectedBookData.copiesAmount);
				} catch (err) {
					if (err.response && err.response.status <= 500) {
					}
				}
			}
		})();
	}, [dialogIsOpen]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			await BookService.editBook(selectedBookData.id, values);
			onCloseDialog(null, true);
			formik.resetForm();
			setSnackbar({ open: true, message: `Book ${values.isbn} edited successfully!`, severity: "success" });
		} catch (err) {
			if (err.response && err.response.status === 400) {
				switch (err.response.data.code) {
					case "isbn.any.required":
						setFieldError("isbn", "Field required");
						break;
					case "isbn.string.matches":
						setFieldError("isbn", "ISBN should be in correct format");
						break;
					case "isbn.string.length":
						setFieldError("isbn", "ISBN should be 13 characters long");
						break;
					case "isbn.string.empty":
						setFieldError("isbn", "Field required");
						break;
					case "title.any.required":
						setFieldError("title", "Field required");
						break;
					case "title.string.max":
						setFieldError("title", "Title should be maximum 255 characters long");
						break;
					case "title.string.empty":
						setFieldError("title", "Field required");
						break;
					case "authors.string.max":
						setFieldError("authors", "Authors should be maximum 255 characters long");
						break;
					case "year.number.min":
						setFieldError("year", "Year should be greater than -4000");
						break;
					case "year.number.max":
						setFieldError("year", "Year should be less than 10000");
						break;
					case "copiesAmount.number.min":
						setFieldError("copiesAmount", "Amount of copies should be at minimum 0");
						break;
					case "isbn.duplicate":
						setFieldError("isbn", "ISBN already exists");
						break;
					case "book.duplicate":
						setFieldError("isbn", "ISBN already exists");
						break;
					default:
				}
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			isbn: "",
			title: "",
			authors: "",
			year: "",
			copiesAmount: "",
		},
		validationSchema: yup.object().shape({
			isbn: yup.string().matches(/^\d+$/).length(13).required("ISBN is required"),
			title: yup.string().max(255).required(),
			authors: yup.string().max(255).required(),
			year: yup.number().integer().required(),
			copiesAmount: yup.number().integer().min(0).required(),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<Dialog open={dialogIsOpen} onClose={onCloseDialog}>
			<form onSubmit={formik.handleSubmit}>
				<Box sx={{ mb: 2, pt: 4, pl: 5 }}>
					<Typography color="textPrimary" variant="h2">
						Edit book
					</Typography>
					<Typography color="textSecondary" gutterBottom variant="body2">
						Leave the same value if you dont want to edit that field
					</Typography>
				</Box>
				<Box sx={{ mb: 2, pl: 4, pr: 4 }}>
					<TextField
						error={Boolean(formik.touched.isbn && formik.errors.isbn)}
						fullWidth
						helperText={formik.touched.isbn && formik.errors.isbn}
						label="ISBN"
						margin="normal"
						name="isbn"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.isbn}
						variant="outlined"
						inputProps={{ maxLength: 13 }}
					/>
					<TextField
						error={Boolean(formik.touched.title && formik.errors.title)}
						fullWidth
						helperText={formik.touched.title && formik.errors.title}
						label="Title"
						margin="normal"
						name="title"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.title}
						variant="outlined"
					/>
					<TextField
						error={Boolean(formik.touched.authors && formik.errors.authors)}
						fullWidth
						helperText={formik.touched.authors && formik.errors.authors}
						label="Authors"
						margin="normal"
						name="authors"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.authors}
						variant="outlined"
					/>
					<TextField
						error={Boolean(formik.touched.year && formik.errors.year)}
						fullWidth
						helperText={formik.touched.year && formik.errors.year}
						label="Year"
						margin="normal"
						name="year"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						type="number"
						value={formik.values.year}
						variant="outlined"
					/>
					<TextField
						error={Boolean(formik.touched.copiesAmount && formik.errors.copiesAmount)}
						fullWidth
						helperText={formik.touched.copiesAmount && formik.errors.copiesAmount}
						label="Amount of copies"
						margin="normal"
						name="copiesAmount"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						type="number"
						value={formik.values.copiesAmount}
						variant="outlined"
					/>
				</Box>

				<DialogActions sx={{ p: 4 }}>
					<Button onClick={onCloseDialog}>Cancel</Button>
					<Button variant="contained" type="submit" disabled={formik.isSubmitting}>
						Edit book
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditBookDialog;
