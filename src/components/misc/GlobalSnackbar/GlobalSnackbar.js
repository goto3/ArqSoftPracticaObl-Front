import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GlobalSnackbar = ({ snackbar, setSnackbar }) => {
	function handleClose(event, reason) {
		if (reason === "clickaway") {
			return;
		}
		setSnackbar({ open: false, message: snackbar.message, severity: snackbar.severity });
		setTimeout(() => {
			setSnackbar(false, "", "info");
		}, 150);
	}

	return (
		<Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleClose}>
			<Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
				{snackbar.message}
			</Alert>
		</Snackbar>
	);
};
export default GlobalSnackbar;
