import React, { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, FormControlLabel, Checkbox, Button } from "@material-ui/core";
import TaskAltIcon from "@material-ui/icons/TaskAlt";
import { makeStyles } from "@material-ui/styles";

import OrgReservationContext from "../../context/orgReservationContext";

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

const OrgReservationsToolbar = (props) => {
	const classes = useStyles();

	const { filter, setFilter, canReturn, handleReturnBook } = useContext(OrgReservationContext);

	function onChange(event) {
		const isChecked = event.target.checked;
		if (isChecked) setFilter([...filter, event.target.value]);
		else setFilter(filter.filter((f) => f !== event.target.value));
	}

	return (
		<Box {...props}>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<div className={classes.root}>
							<div className={classes.container}>
								<div className={classes.itemFlexGrow}>
									<FormControlLabel sx={{ mr: 3 }} value="pending" onChange={onChange} control={<Checkbox defaultChecked />} label="Pending" />
									<FormControlLabel sx={{ mr: 3 }} value="started" onChange={onChange} control={<Checkbox defaultChecked />} label="Started" />
									<FormControlLabel sx={{ mr: 3 }} value="finished" onChange={onChange} control={<Checkbox defaultChecked />} label="Finished" />
									<FormControlLabel sx={{ mr: 3 }} value="missing" onChange={onChange} control={<Checkbox defaultChecked />} label="Missing" />
								</div>
								<div className={classes.item}>
									<Button sx={{ mx: 1 }} variant="contained" color="success" startIcon={<TaskAltIcon />} disabled={!canReturn} onClick={handleReturnBook}>
										Return book
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

export default OrgReservationsToolbar;
