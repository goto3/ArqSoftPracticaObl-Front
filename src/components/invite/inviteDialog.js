import React, { useEffect, useContext } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import { sendInvite } from "../../services/inviteService";

import SnackbarContext from "../../context/snackbarContext";

const InviteDialog = ({ dialogIsOpen, onCloseDialog, organization: orgName }) => {
	const { setSnackbar } = useContext(SnackbarContext);
	useEffect(() => {
		formik.resetForm();
	}, [dialogIsOpen]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			await sendInvite(values.email, values.permission, orgName);
			onCloseDialog();
			setSnackbar({ open: true, message: "Invite sent successfully!", severity: "success" });
			formik.resetForm();
		} catch (err) {
			if (err.response.status === 400) {
				switch (err.response.data.code) {
					case "email.any.required":
						setFieldError("email", "Field required");
						break;
					case "email.string.min":
						setFieldError("email", "Email should be at least 5 characters long");
						break;
					case "email.string.max":
						setFieldError("email", "Email should be maximum 255 characters long");
						break;
					case "email.string.empty":
						setFieldError("email", "Field required");
						break;
					case "email.string.email":
						setFieldError("email", "Must be a valid email");
						break;
					case "invite.duplicate":
						setFieldError("email", "Already exists an invite with this address");
						break;
					case "invite.unforbidden":
						setFieldError("email", "You have no permission to invite other users");
						break;
					case "invite.userAlreadyBelongs":
						setFieldError("email", "Already belongs to this organization");
						break;
					default:
				}
			} else {
				setSnackbar({ open: true, message: "Error sending invite, try again later", severity: "error" });
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			permission: "Student",
		},
		validationSchema: yup.object().shape({
			email: yup.string().email("Must be a valid email").max(255).required("Email is required"),
			permission: yup.string().required("Permission is required"),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<Dialog open={dialogIsOpen} onClose={onCloseDialog}>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle sx={{ fontSize: 24 }}>Invite users</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ marginBottom: 0 }}>
						Invite new users to <b>{orgName}</b> organization:
					</DialogContentText>
					<TextField
						autoFocus
						error={Boolean(formik.touched.email && formik.errors.email)}
						fullWidth
						helperText={formik.touched.email && formik.errors.email}
						label="Email Address"
						margin="dense"
						name="email"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						type="email"
						value={formik.values.email}
						variant="standard"
					/>
					<TextField
						select
						error={Boolean(formik.touched.permission && formik.errors.permission)}
						fullWidth
						helperText={formik.touched.permission && formik.errors.permission}
						label="Permission"
						margin="dense"
						name="permission"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.permission}
						variant="standard">
						<MenuItem key={"Administrator"} value={"Administrator"}>
							Administrator
						</MenuItem>
						<MenuItem key={"Student"} value={"Student"}>
							Student
						</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions sx={{ margin: 1 }}>
					<Button onClick={onCloseDialog}>Cancel</Button>
					<Button variant="contained" type="submit" disabled={formik.isSubmitting}>
						Invite
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default InviteDialog;
