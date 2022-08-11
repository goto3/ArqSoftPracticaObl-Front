import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Container, TextField, Typography } from "@material-ui/core";
import UserContext from "../context/userContext";

import * as OrganizationService from "../services/organizationService";

const CreateOrganization = () => {
	const navigate = useNavigate();
	const { handleLoginLogout, currentUser } = useContext(UserContext);

	useEffect(() => {
		if (currentUser) navigate("/app/books", { replace: true });
	}, [currentUser]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			await OrganizationService.postOrganization(values);
			handleLoginLogout();
			navigate("/app/books", { replace: true });
			//Snackbar on parent
		} catch (err) {
			if (err.response && err.response.status === 400) {
				switch (err.response.data.code) {
					case "userName.any.required":
						setFieldError("userName", "Field required");
						break;
					case "userName.string.min":
						setFieldError("userName", "User name should be at least 5 characters long");
						break;
					case "userName.string.max":
						setFieldError("userName", "User name should be maximum 50 characters long");
						break;
					case "userName.string.empty":
						setFieldError("userName", "Field required");
						break;
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
					case "password.any.required":
						setFieldError("password", "Field required");
						break;
					case "password.string.min":
						setFieldError("password", "Password should be at least 5 characters long");
						break;
					case "password.string.max":
						setFieldError("password", "Passowrd name should be maximum 255 characters long");
						break;
					case "password.string.empty":
						setFieldError("password", "Field required");
						break;
					case "name.any.required":
						setFieldError("orgName", "Field required");
						break;
					case "name.string.min":
						setFieldError("orgName", "Organization name should be at least 5 characters long");
						break;
					case "name.string.max":
						setFieldError("orgName", "Organization name should be maximum 50 characters long");
						break;
					case "name.string.empty":
						setFieldError("orgName", "Field required");
						break;
					case "organization.duplicate":
						setFieldError("orgName", "Organization name already exists");
						break;
					case "email.duplicate":
						setFieldError("email", "Email address already exists");
						break;
					default:
				}
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			userName: "",
			orgName: "",
			password: "",
		},
		validationSchema: yup.object().shape({
			email: yup.string().email("Must be a valid email").max(255).required("Email is required"),
			userName: yup.string().max(255).required("First name is required"),
			orgName: yup.string().max(255).required("Organization name is required"),
			password: yup.string().max(255).required("password is required"),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<>
			<Helmet>
				<title>Create Organization</title>
			</Helmet>
			<Box
				sx={{
					backgroundColor: "background.default",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
				}}>
				<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}>
						<Box sx={{ mb: 2 }}>
							<Typography color="textPrimary" variant="h2">
								Create new organization
							</Typography>
							<Typography color="textSecondary" gutterBottom variant="body2">
								With an administrator account
							</Typography>
						</Box>
						<TextField
							error={Boolean(formik.touched.orgName && formik.errors.orgName)}
							fullWidth
							helperText={formik.touched.orgName && formik.errors.orgName}
							label="Organization name"
							margin="normal"
							name="orgName"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.orgName}
							variant="outlined"
						/>
						<TextField
							error={Boolean(formik.touched.userName && formik.errors.userName)}
							fullWidth
							helperText={formik.touched.userName && formik.errors.userName}
							label="First name"
							margin="normal"
							name="userName"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.userName}
							variant="outlined"
						/>
						<TextField
							error={Boolean(formik.touched.email && formik.errors.email)}
							fullWidth
							helperText={formik.touched.email && formik.errors.email}
							label="Email Address"
							margin="normal"
							name="email"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="email"
							value={formik.values.email}
							variant="outlined"
						/>
						<TextField
							error={Boolean(formik.touched.password && formik.errors.password)}
							fullWidth
							helperText={formik.touched.password && formik.errors.password}
							label="Password"
							margin="normal"
							name="password"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="password"
							value={formik.values.password}
							variant="outlined"
						/>
						<Box sx={{ py: 2 }}>
							<Button color="primary" disabled={formik.isSubmitting} fullWidth size="large" type="submit" variant="contained">
								Create organization
							</Button>
						</Box>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default CreateOrganization;
