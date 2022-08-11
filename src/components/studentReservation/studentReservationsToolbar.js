import React, { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, FormControlLabel, Checkbox, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SnackbarContext from "../../context/snackbarContext";

import * as NotificationService from "../../services/notificationService";

import StudentReservationContext from "../../context/studentReservationContext";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
	},
	item: {
		paddingLeft: 15,
		paddingTop: 10,
	},
	itemFlexGrow: {
		paddingTop: 8,
		paddingLeft: 10,
		flexGrow: 1,
	},
}));

const StudentReservationsToolbar = (props) => {
	const { setSnackbar } = useContext(SnackbarContext);
	const classes = useStyles();

	const { filter, setFilter } = useContext(StudentReservationContext);
	const [notifications, setNotifications] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await NotificationService.getNotificationStatus();
				setNotifications(data);
			} catch (error) {
				setSnackbar({ open: true, message: `Error fetching notification status from API`, severity: "error" });
			}
		})();
	}, []);

	function onChange(event) {
		const isChecked = event.target.checked;
		if (isChecked) setFilter([...filter, event.target.value]);
		else setFilter(filter.filter((f) => f !== event.target.value));
	}

	async function onChangeNotifications(event) {
		const isChecked = event.target.checked;
		try {
			const { data } = await NotificationService.setNotificationStatus(isChecked);
			setNotifications(data);
		} catch (error) {
			setSnackbar({ open: true, message: `Error setting notification status from API`, severity: "error" });
		}
	}

	return (
		<Box {...props}>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<div className={classes.root}>
							<div className={classes.container}>
								<div className={classes.itemFlexGrow}>
									<FormControlLabel value="pending" onChange={onChange} control={<Checkbox defaultChecked />} label="Pending" />
									<FormControlLabel value="started" onChange={onChange} control={<Checkbox defaultChecked />} label="Started" />
									<FormControlLabel value="finished" onChange={onChange} control={<Checkbox defaultChecked />} label="Finished" />
									<FormControlLabel value="missing" onChange={onChange} control={<Checkbox defaultChecked />} label="Missing" />
								</div>
								<div className={classes.item}>
									<FormControlLabel checked={notifications} onChange={onChangeNotifications} control={<Checkbox />} label="Notify me 24 hours before end date" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default StudentReservationsToolbar;
