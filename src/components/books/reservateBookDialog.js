import React, { useEffect, useState, useContext } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Stack } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import moment from "moment";

import SnackbarContext from "../../context/snackbarContext";

import * as ReservationService from "../../services/reservationService";

const ReservateBookDialog = ({ dialogIsOpen, onCloseDialog, selectedBookData }) => {
	const [error, setError] = useState("");
	const { setSnackbar } = useContext(SnackbarContext);

	useEffect(() => {
		formik.resetForm();
		setError("");
	}, [dialogIsOpen]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			const formatedDate = moment(values.date).format("yyyy-MM-DD");
			await ReservationService.postReservation(selectedBookData.id, formatedDate);
			onCloseDialog();
			formik.resetForm();
			setSnackbar({ open: true, message: `Successfully created a reservation for ${formatedDate}.`, severity: "success" });
		} catch (err) {
			if (err.response.status === 400) {
				switch (err.response.data.type) {
					case "Duplicate error":
						setError("You already created a reservation for this date");
						break;
					case "Invalid Date":
						setError("Date must be after today");
						break;
					case "No copies available":
						setError("There are no copies avaliable for this date");
						break;
					case "User Penalized":
						setError("Can not create reservation. You are penalized.");
						setSnackbar({ open: true, message: `You need to return previous reservation books before creating new ones.`, severity: "error" });
						break;
					default:
						setError("An error occured creating the reservation");
						break;
				}
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			date: moment().add(1, "days").startOf("day"),
		},
		validationSchema: yup.object().shape({
			date: yup.date().required().max(new Date("2200-10-10")),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<Dialog open={dialogIsOpen} onClose={onCloseDialog}>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle sx={{ fontSize: 24 }}>Create reservation</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ marginBottom: 0 }}>ISBN: {selectedBookData && selectedBookData.isbn}</DialogContentText>
					<Stack sx={{ minWidth: 360, paddingTop: 4 }}>
						<LocalizationProvider dateAdapter={DateAdapter}>
							<MobileDatePicker
								inputFormat="DD/MM/YYYY"
								label="Date"
								value={formik.values.date}
								minDate={moment().add(1, "days").startOf("day")}
								onChange={(newValue) => {
									formik.setFieldValue("date", newValue, true);
									setError("");
								}}
								renderInput={(params) => <TextField {...params} error={error !== ""} helperText={error} />}
							/>
						</LocalizationProvider>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ margin: 1 }}>
					<Button onClick={onCloseDialog}>Cancel</Button>
					<Button variant="contained" type="submit" disabled={formik.isSubmitting}>
						Accept
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ReservateBookDialog;
