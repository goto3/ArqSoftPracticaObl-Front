import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Container, TextField, Typography } from "@material-ui/core";
import UserContext from "../context/userContext";
import SnackbarContext from "../context/snackbarContext";

import * as InviteService from "../services/inviteService";
import * as UserService from "../services/userService";
import * as Auth from "../services/authService";

const Join = () => {
	const navigate = useNavigate();
	const { setSnackbar } = useContext(SnackbarContext);
	const { id } = useParams();
	const { currentUser, handleLoginLogout } = useContext(UserContext);
	const [invite, setInvite] = useState({ email: "" });

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			const { data } = await UserService.postUser(values, id);
			await Auth.loginWithJWT(data.token);
			await handleLoginLogout();
			navigate("/app/books", { replace: true });
			setSnackbar({ open: true, message: `Successfully joined ${invite.OrganizationName}!`, severity: "success" });
		} catch (err) {
			if (err.response && err.response.status === 400) {
				switch (err.response.data.code) {
					case "userName.any.required":
						setFieldError("name", "Field required");
						break;
					case "userName.string.min":
						setFieldError("name", "User name should be at least 5 characters long");
						break;
					case "userName.string.max":
						setFieldError("name", "User name should be maximum 50 characters long");
						break;
					case "userName.string.empty":
						setFieldError("name", "Field required");
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

	const formikRegister = useFormik({
		initialValues: {
			email: invite.email,
			name: "",
			password: "",
		},
		validationSchema: yup.object().shape({
			email: yup.string().min(5).max(255).email("Must be a valid email").required("Email is required"),
			name: yup.string().min(5).max(255).required("First name is required"),
			password: yup.string().min(5).max(255).required("password is required"),
		}),
		onSubmit: handleSubmit,
	});

	useEffect(() => {
		(async () => {
			try {
				const invite = await InviteService.getInvite(id);
				setInvite(invite.data);
			} catch (err) {
				if (err.response && err.response.status <= 500) {
					navigate("/app/404", { replace: true });
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (currentUser && currentUser.email !== invite.email) navigate("/app/403", { replace: true });
		formikRegister.setFieldValue("email", invite.email);
	}, [invite]);

	const joinOrganization = async () => {
		try {
			await InviteService.deleteInvite(id, currentUser.email);
			handleLoginLogout();
			navigate("/app/books", { replace: true });
			setSnackbar({ open: true, message: `Successfully joined ${invite.OrganizationName}!`, severity: "success" });
		} catch (err) {
			console.log(err.response);
		}
	};

	return (
		<>
			<Helmet>
				<title>Join organization</title>
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
					<Box sx={{ mb: 2 }}>
						<Typography color="textPrimary" variant="h2">
							Join '{invite.OrganizationName}' organization as {invite.permission}
						</Typography>
						<Typography color="textSecondary" gutterBottom variant="body2">
							{currentUser && invite ? <>using your account</> : <>crating new account</>}
						</Typography>
					</Box>
					{currentUser && invite ? (
						<Button color="primary" fullWidth size="large" onClick={joinOrganization} variant="contained">
							Join
						</Button>
					) : (
						<form onSubmit={formikRegister.handleSubmit}>
							<TextField
								autoFocus
								error={Boolean(formikRegister.touched.name && formikRegister.errors.name)}
								fullWidth
								helperText={formikRegister.touched.name && formikRegister.errors.name}
								label="Name"
								margin="normal"
								name="name"
								type="text"
								onBlur={formikRegister.handleBlur}
								onChange={formikRegister.handleChange}
								value={formikRegister.values.name}
								variant="outlined"
								autoComplete="off"
							/>
							<TextField
								error={Boolean(formikRegister.touched.email && formikRegister.errors.email)}
								fullWidth
								helperText={formikRegister.touched.email && formikRegister.errors.email}
								label="Email Address"
								margin="normal"
								name="email"
								onBlur={formikRegister.handleBlur}
								onChange={formikRegister.handleChange}
								type="email"
								value={formikRegister.values.email}
								variant="outlined"
								autoComplete="off"
								disabled
							/>
							<TextField
								error={Boolean(formikRegister.touched.password && formikRegister.errors.password)}
								fullWidth
								helperText={formikRegister.touched.password && formikRegister.errors.password}
								label="Password"
								margin="normal"
								name="password"
								onBlur={formikRegister.handleBlur}
								onChange={formikRegister.handleChange}
								type="password"
								value={formikRegister.values.password}
								variant="outlined"
								autoComplete="new-password"
							/>

							<Box sx={{ py: 2 }}>
								<Button color="primary" disabled={formikRegister.isSubmitting} fullWidth size="large" type="submit" variant="contained">
									Join
								</Button>
							</Box>
						</form>
					)}
				</Container>
			</Box>
		</>
	);
};

export default Join;
