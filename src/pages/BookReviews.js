import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import ReviewList from "../components/reviews/ReviewList";
import ReviewsToolbar from "../components/reviews/ReviewsToolbar";
import AddReviewDialog from "../components/reviews/AddReviewDialog";

import BookReviewContext from "../context/bookReviewContext";
import SnackbarContext from "../context/snackbarContext";

import * as ReviewService from "../services/reviewService";

const DEFAULT_LIMIT = 20;

const BookReviews = () => {
	const navigate = useNavigate();
	const { setSnackbar } = useContext(SnackbarContext);

	const { bookId } = useParams();

	const [reviews, setReviews] = useState([]);
	const [ownReview, setOwnReview] = useState(false);
	const [selectedReview, setSelectedReview] = useState("");
	const [selectedReviewData, setSelectedReviewData] = useState({});
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [count, setCount] = useState(0);
	const [addReviewDialogIsOpen, addReviewDialogOpen] = useState(false);

	useEffect(() => {
		(async () => {
			await fetchReviews();
		})();
	}, [page, limit, ownReview]);

	const fetchReviews = async () => {
		try {
			if (ownReview) {
				const { data } = await ReviewService.getReviews(bookId, true);
				if (data) {
					setReviews([data]);
					setCount(1);
				} else {
					setReviews([]);
					setCount(0);
				}
			} else {
				const { data } = await ReviewService.getReviews(bookId, false, page + 1, limit);
				setReviews(data.rows);
				setCount(data.count);
			}
		} catch (error) {
			setSnackbar({ open: true, message: `Error fetching reviews from API`, severity: "error" });
		}
	};

	function handleSelectReview(id) {
		setSelectedReviewData(reviews.find((r) => r.id === id));
		setSelectedReview(id);
	}

	function handlePageChange(newPage) {
		setPage(newPage);
	}

	function handleLimitChange(newLimit) {
		setPage(0);
		setLimit(newLimit);
	}

	function handleAddReview() {
		//TODO check if user can add review
		addReviewDialogOpen(true);
	}

	async function handleDeleteReview() {
		try {
			await ReviewService.deleteReview(selectedReview);
			const newReviews = reviews.filter((r) => r.id !== selectedReview);
			setReviews(newReviews);
			setCount(count - 1);
			handleSelectReview("");
			setSnackbar({ open: true, message: `Review: ${selectedReview} deleted successfully!`, severity: "success" });
		} catch (error) {
			if (error.response && error.response.status === 400) {
				switch (error.response.data.code) {
					case "review.delete.tooOld":
						setSnackbar({ open: true, message: `Unable to delete review ${selectedReview} because it is older than 24 hours.`, severity: "error" });
						break;
					default:
				}
			}
		}
	}

	function handleCloseDialogs(event, refresh = false) {
		if (refresh) {
			fetchReviews();
			setSelectedReview("");
		}
		addReviewDialogOpen(false);
	}

	return (
		<>
			<Helmet>
				<title>Reviews for book {bookId}</title>
			</Helmet>
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100%",
					py: 0,
				}}>
				<Container maxWidth={false}>
					<BookReviewContext.Provider
						value={{
							reviews,
							page,
							setPage,
							limit,
							selectedReview,
							selectedReviewData,
							count,
							setOwnReview,
							handleSelectReview,
							handleAddReview,
							handleDeleteReview,
							handlePageChange,
							handleLimitChange,
						}}>
						<ReviewsToolbar />
						<Box sx={{ pt: 3 }}>
							<ReviewList />
						</Box>
					</BookReviewContext.Provider>
				</Container>
			</Box>
			<AddReviewDialog onCloseDialog={handleCloseDialogs} dialogIsOpen={addReviewDialogIsOpen} bookId={bookId} />
		</>
	);
};

export default BookReviews;
