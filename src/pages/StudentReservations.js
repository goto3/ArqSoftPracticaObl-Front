import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import StudentReservationList from "../components/studentReservation/studentReservationList";
import StudentReservationsToolbar from "../components/studentReservation/studentReservationsToolbar";

import StudentReservationContext from "../context/studentReservationContext";
import UserContext from "../context/userContext";
import SnackbarContext from "../context/snackbarContext";

import * as ReservationService from "../services/reservationService";

const StudentReservations = () => {
	const { setSnackbar } = useContext(SnackbarContext);
	const { selectedOrgIndex } = useContext(UserContext);

	const [reservations, setReservations] = useState([]);
	const [filter, setFilter] = useState(["pending", "started", "finished", "missing"]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await ReservationService.fetchReservations(filter);
				setReservations(data);
			} catch (error) {
				setSnackbar({ open: true, message: `Error fetching reservations from API`, severity: "error" });
			}
		})();
	}, [selectedOrgIndex, filter]);

	return (
		<>
			<Helmet>
				<title>Reservations</title>
			</Helmet>
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100%",
					py: 0,
				}}>
				<Container maxWidth={false}>
					<StudentReservationContext.Provider
						value={{
							reservations,
							filter,
							setFilter,
						}}>
						<StudentReservationsToolbar />
						<Box sx={{ pt: 3 }}>
							<StudentReservationList />
						</Box>
					</StudentReservationContext.Provider>
				</Container>
			</Box>
		</>
	);
};

export default StudentReservations;
