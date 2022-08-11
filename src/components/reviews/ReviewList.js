import { useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Checkbox, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from "@material-ui/core";
import ReviewsTableHeader from "./ReviewsTableHeader";

import bookReviewContext from "../../context/bookReviewContext";

const ReviewList = ({ ...rest }) => {
	const { reviews, page, handlePageChange, limit, handleLimitChange, count, selectedReview, handleSelectReview } = useContext(bookReviewContext);

	const handleSelectOne = (event, id) => {
		if (selectedReview === id) handleSelectReview("");
		else handleSelectReview(id);
	};

	const onLimitChange = (event) => {
		handleLimitChange(event.target.value);
	};

	const onPageChange = (event, newPage) => {
		handlePageChange(newPage);
	};

	return (
		<Card {...rest}>
			{reviews && reviews.length == 0 ? (
				<>
					<Typography align="center" sx={{ padding: 10 }} color="textPrimary" gutterBottom variant="h4">
						No reviews found
					</Typography>
				</>
			) : (
				<>
					<PerfectScrollbar>
						<Box sx={{ minWidth: 1050 }}>
							<Table>
								<ReviewsTableHeader />
								<TableBody>
									{reviews.slice(0, limit).map((review) => (
										<TableRow hover onClick={(event) => handleSelectOne(event, review.id)} key={review.id} selected={selectedReview === review.id}>
											<TableCell padding="checkbox">
												<Checkbox checked={selectedReview === review.id} onChange={(event) => handleSelectOne(event, review.id)} value="true" />
											</TableCell>
											<TableCell>
												<Box
													sx={{
														alignItems: "center",
														display: "flex",
													}}>
													<Typography color="textPrimary" variant="body1">
														{review.id}
													</Typography>
												</Box>
											</TableCell>
											<TableCell>{review.bookId}</TableCell>
											<TableCell>{review.owner}</TableCell>
											<TableCell>{review.rating}</TableCell>
											<TableCell>{review.review}</TableCell>
											<TableCell>{review.createdAt}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</PerfectScrollbar>
					<TablePagination
						component="div"
						count={count}
						onPageChange={onPageChange}
						onRowsPerPageChange={onLimitChange}
						page={page}
						rowsPerPage={limit}
						rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
					/>{" "}
				</>
			)}
		</Card>
	);
};

export default ReviewList;
