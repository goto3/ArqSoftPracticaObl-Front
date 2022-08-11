import { useContext, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Table, TableBody, TableCell, TableRow, Typography, Checkbox } from "@material-ui/core";
import ReservationHeader from "./orgReservationTableHeader";

import OrgReservationContext from "../../context/orgReservationContext";

const OrgReservationList = ({ ...rest }) => {
	const { reservations, selectedReservation, handleSelectReservation } = useContext(OrgReservationContext);

	const handleSelectOne = (event, id) => {
		if (selectedReservation === id) handleSelectReservation("");
		else handleSelectReservation(id);
	};

	return (
		<Card {...rest}>
			{reservations && reservations.length == 0 ? (
				<>
					<Typography align="center" sx={{ padding: 10 }} color="textPrimary" gutterBottom variant="h4">
						No reservations found
					</Typography>
				</>
			) : (
				<>
					<PerfectScrollbar>
						<Box sx={{ minWidth: 1050 }}>
							<Table>
								<ReservationHeader />
								<TableBody>
									{reservations &&
										reservations.map((reservation) => (
											<TableRow hover onClick={(event) => handleSelectOne(event, reservation.id)} key={reservation.id} selected={selectedReservation === reservation.id}>
												<TableCell padding="checkbox">
													<Checkbox checked={selectedReservation === reservation.id} value="true" />
												</TableCell>

												<TableCell>
													<Box
														sx={{
															alignItems: "center",
															display: "flex",
														}}>
														<Typography color="textPrimary" variant="body1">
															{reservation.id}
														</Typography>
													</Box>
												</TableCell>
												<TableCell>{reservation.Book.isbn}</TableCell>
												<TableCell>{reservation.Book.title}</TableCell>
												<TableCell>{reservation.startDate}</TableCell>
												<TableCell>{reservation.endDate}</TableCell>
												<TableCell>{reservation.status}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</Box>
					</PerfectScrollbar>
				</>
			)}
		</Card>
	);
};

export default OrgReservationList;
