import { useContext } from "react";
import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core";
import { visuallyHidden } from "@material-ui/utils";

import BookContext from "../../context/bookContext";

const BooksTableHeader = () => {
	const { orderBy, order, handleSort } = useContext(BookContext);

	const createSortHandler = (property) => (event) => {
		handleSort(event, property);
	};

	const headCells = [
		{
			id: "isbn",
			numeric: false,
			disablePadding: false,
			label: "isbn",
			sortable: true,
		},
		{
			id: "title",
			numeric: false,
			disablePadding: false,
			label: "Title",
			sortable: true,
		},
		{
			id: "authors",
			numeric: false,
			disablePadding: false,
			label: "Authors",
			sortable: false,
		},
		{
			id: "year",
			numeric: true,
			disablePadding: false,
			label: "Year",
			sortable: true,
		},
		{
			id: "copies",
			numeric: true,
			disablePadding: false,
			label: "Number of copies",
			sortable: false,
		},
	];

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox"></TableCell>
				{headCells.map((headCell) => {
					if (headCell.sortable) {
						return (
							<TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
								<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
									{headCell.label}
									{orderBy === headCell.id ? (
										<Box component="span" sx={visuallyHidden}>
											{order === "desc" ? "sorted descending" : "sorted ascending"}
										</Box>
									) : null}
								</TableSortLabel>
							</TableCell>
						);
					} else {
						return (
							<TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? "none" : "normal"}>
								{headCell.label}
							</TableCell>
						);
					}
				})}
			</TableRow>
		</TableHead>
	);
};

export default BooksTableHeader;
