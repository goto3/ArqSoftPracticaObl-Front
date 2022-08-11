import { useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from "@material-ui/core";
import ReservationHeader from "./studentReservationTableHeader";

import StudentReservationContext from "../../context/studentReservationContext";

const StudentReservationList = ({ ...rest }) => {
	const { reservations } = useContext(StudentReservationContext);

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
											<TableRow hover key={reservation.id}>
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

export default StudentReservationList;
