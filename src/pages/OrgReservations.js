import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import OrgReservationList from "../components/orgReservation/orgReservationList";
import OrgReservationsToolbar from "../components/orgReservation/orgReservationsToolbar";

import OrgReservationContext from "../context/orgReservationContext";
import UserContext from "../context/userContext";
import SnackbarContext from "../context/snackbarContext";

import * as ReservationService from "../services/reservationService";

const OrgReservations = () => {
	const { setSnackbar } = useContext(SnackbarContext);
	const { selectedOrgIndex } = useContext(UserContext);

	const [selectedReservation, setSelectedReservation] = useState("");
	const [reservations, setReservations] = useState([]);
	const [filter, setFilter] = useState(["pending", "started", "finished", "missing"]);
	const [canReturn, setCanReturn] = useState(false);

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

	function handleSelectReservation(index) {
		setSelectedReservation(index);
		if (index) {
			const reservation = reservations.find((r) => r.id === index);
			setCanReturn(!reservation.returned);
		} else {
			setCanReturn(false);
		}
	}

	async function handleReturnBook() {
		try {
			await ReservationService.returnBook(selectedReservation);
			const { data } = await ReservationService.fetchReservations(filter);
			setReservations(data);
			setSelectedReservation("");
			setSnackbar({ open: true, message: "Successfully returned book and finished reservation", severity: "success" });
		} catch (error) {
			console.log(error.response);
			if (error.response && error.response.data.code === "ERR_FINISHRESERVATION_STARTDATEAFTERNOW") setSnackbar({ open: true, message: error.response.data.message, severity: "error" });
		}
	}

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
					<OrgReservationContext.Provider
						value={{
							reservations,
							filter,
							setFilter,
							handleSelectReservation,
							selectedReservation,
							canReturn,
							handleReturnBook,
						}}>
						<OrgReservationsToolbar />
						<Box sx={{ pt: 3 }}>
							<OrgReservationList />
						</Box>
					</OrgReservationContext.Provider>
				</Container>
			</Box>
		</>
	);
};

export default OrgReservations;
