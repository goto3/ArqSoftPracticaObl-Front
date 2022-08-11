import { useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Container, Link, TextField, Typography } from "@material-ui/core";
import UserContext from "../context/userContext";

import * as Auth from "../services/authService";

const Login = () => {
	const navigate = useNavigate();
	const { handleLoginLogout, currentUser } = useContext(UserContext);

	useEffect(() => {
		if (currentUser) navigate("/app/books", { replace: true });
	}, [currentUser]);

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			await Auth.login(values);
			await handleLoginLogout();
			navigate("/app/books", { replace: true });
			//Snackbar on parent
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
					default:
				}
			} else if (err.response.status === 401) {
				setFieldError("email", "Invalid credentials");
				setFieldError("password", "Invalid credentials");
			}
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object().shape({
			email: yup.string().email("Must be a valid email").max(255).required("Email is required"),
			password: yup.string().max(255).required("password is required"),
		}),
		onSubmit: handleSubmit,
	});

	return (
		<>
			<Helmet>
				<title>Login</title>
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
								Sign in
							</Typography>
							<Typography color="textSecondary" gutterBottom variant="body2">
								with your credentials
							</Typography>
						</Box>
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
								Sign in
							</Button>
						</Box>
						<Typography color="textSecondary" variant="body1">
							Don&apos;t have an account? Ask your organization for an invite or
							<br />
							<Link component={RouterLink} to="/app/neworg" variant="h6" underline="hover">
								Create an organization
							</Link>
						</Typography>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default Login;
