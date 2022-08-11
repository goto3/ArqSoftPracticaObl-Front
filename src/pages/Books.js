import React, { useState, useEffect, useContext, useRef } from "react";
import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import BookList from "../components/books/BookList";
import BooksToolbar from "../components/books/BooksToolbar";
import ReservateBookDialog from "../components/books/reservateBookDialog";
import AddBookDialog from "../components/books/addBookDialog";
import EditBookDialog from "../components/books/editBookDialog";

import BookContext from "../context/bookContext";
import UserContext from "../context/userContext";
import SnackbarContext from "../context/snackbarContext";

import * as BookService from "../services/bookService";

const DEFAULT_LIMIT = 20;
var canFetch = true;

const Books = () => {
	const { selectedOrgIndex } = useContext(UserContext);
	const { setSnackbar } = useContext(SnackbarContext);

	const [books, setBooks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedBook, setSelectedBook] = useState("");
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [orderBy, setOrderBy] = useState("isbn");
	const [order, setOrder] = useState("asc");
	const [count, setCount] = useState(0);
	const [resDialogIsOpen, setResDialogOpen] = useState(false);
	const [addDialogIsOpen, setAddDialogOpen] = useState(false);
	const [editDialogIsOpen, setEditDialogOpen] = useState(false);

	function usePrevious(value) {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	}
	const prevData = usePrevious({ searchQuery, selectedOrgIndex, order, orderBy, page, limit });

	useEffect(() => {
		(async () => {
			if (selectedOrgIndex != null) {
				setSelectedBook("");
				setPage(0);
				await fetchBooks();
			}
		})();
	}, [searchQuery, selectedOrgIndex, order, orderBy]);

	useEffect(() => {
		(async () => {
			if (prevData) {
				await fetchBooks();
			}
		})();
	}, [page, limit]);

	const fetchBooks = async () => {
		if (canFetch) {
			canFetch = false;
			try {
				const { data } = await BookService.getAllBooks(searchQuery, page + 1, limit, `${orderBy}.${order}`);
				setBooks(data.rows);
				setCount(data.count);
			} catch (error) {
				setSnackbar({ open: true, message: `Error fetching books from API`, severity: "error" });
			}
			setTimeout(() => {
				canFetch = true;
			}, 100);
		}
	};

	function handleSearchQueryChange(query) {
		setSearchQuery(query);
	}

	function handleSelectBook(index) {
		setSelectedBook(index);
	}

	function handlePageChange(newPage) {
		setPage(newPage);
	}

	function handleLimitChange(newLimit) {
		setPage(0);
		setLimit(newLimit);
	}

	function handleSort(event, property) {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	}

	async function handleDeleteBook() {
		try {
			await BookService.deleteBook(selectedBook);
			const newBooks = books.filter((b) => b.id !== selectedBook);
			setBooks(newBooks);
			setCount(count - 1);
			setSelectedBook("");
			setSnackbar({ open: true, message: `Book: ${selectedBook} deleted successfully!`, severity: "success" });
		} catch (error) {
			if (error.response && error.response.status === 400) {
				switch (error.response.data.code) {
					case "INVALID_PARAMETER":
						setSnackbar({ open: true, message: `Unable to delete book: ${selectedBook} beacause it has pending reservations`, severity: "error" });
						break;
					default:
				}
			}
		}
	}

	function getBookData(id) {
		return books.find((b) => b.id === id);
	}

	function handleRentBook() {
		setResDialogOpen(true);
	}

	function handleAddBook() {
		setAddDialogOpen(true);
	}

	function handleEditBook() {
		setEditDialogOpen(true);
	}

	function handleCloseDialogs(event, refresh = false) {
		if (refresh) {
			fetchBooks();
			setSelectedBook("");
		}
		setResDialogOpen(false);
		setAddDialogOpen(false);
		setEditDialogOpen(false);
	}

	return (
		<>
			<Helmet>
				<title>Books</title>
			</Helmet>
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100%",
					py: 0,
				}}>
				<Container maxWidth={false}>
					<BookContext.Provider
						value={{
							books,
							page,
							limit,
							searchQuery,
							selectedBook,
							order,
							orderBy,
							count,
							handleSelectBook,
							handleSearchQueryChange,
							handleAddBook,
							handleDeleteBook,
							handleEditBook,
							handleRentBook,
							handlePageChange,
							handleLimitChange,
							handleSort,
						}}>
						<BooksToolbar />
						<Box sx={{ pt: 3 }}>
							<BookList />
						</Box>
					</BookContext.Provider>
				</Container>
			</Box>
			<ReservateBookDialog onCloseDialog={handleCloseDialogs} dialogIsOpen={resDialogIsOpen} selectedBookData={getBookData(selectedBook)} />
			<AddBookDialog onCloseDialog={handleCloseDialogs} dialogIsOpen={addDialogIsOpen} />
			<EditBookDialog onCloseDialog={handleCloseDialogs} dialogIsOpen={editDialogIsOpen} selectedBookData={getBookData(selectedBook)} />
		</>
	);
};

export default Books;
