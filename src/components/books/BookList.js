import { useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Checkbox, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from "@material-ui/core";
import BooksTableHeader from "./booksTableHeader";

import BookContext from "../../context/bookContext";

const BookList = ({ ...rest }) => {
	const { books, page, handlePageChange, limit, handleLimitChange, count, selectedBook, handleSelectBook } = useContext(BookContext);

	const handleSelectOne = (event, id) => {
		if (selectedBook === id) handleSelectBook("");
		else handleSelectBook(id);
	};

	const onLimitChange = (event) => {
		handleLimitChange(event.target.value);
	};

	const onPageChange = (event, newPage) => {
		handlePageChange(newPage);
	};

	return (
		<Card {...rest}>
			{books.length == 0 ? (
				<>
					<Typography align="center" sx={{ padding: 10 }} color="textPrimary" gutterBottom variant="h4">
						No books found
					</Typography>
				</>
			) : (
				<>
					<PerfectScrollbar>
						<Box sx={{ minWidth: 1050 }}>
							<Table>
								<BooksTableHeader />
								<TableBody>
									{books.slice(0, limit).map((book) => (
										<TableRow hover onClick={(event) => handleSelectOne(event, book.id)} key={book.id} selected={selectedBook === book.id}>
											<TableCell padding="checkbox">
												<Checkbox checked={selectedBook === book.id} onChange={(event) => handleSelectOne(event, book.id)} value="true" />
											</TableCell>
											<TableCell>
												<Box
													sx={{
														alignItems: "center",
														display: "flex",
													}}>
													<Typography color="textPrimary" variant="body1">
														{book.isbn}
													</Typography>
												</Box>
											</TableCell>
											<TableCell>{book.title}</TableCell>
											<TableCell>{book.authors}</TableCell>
											<TableCell>{book.year}</TableCell>
											<TableCell>{book.copiesAmount}</TableCell>
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

export default BookList;
