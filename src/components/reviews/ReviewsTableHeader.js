import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core";
import { visuallyHidden } from "@material-ui/utils";

const ReviewsTableHeader = () => {
	const headCells = [
		{
			id: "id",
			numeric: false,
			disablePadding: false,
			label: "Review ID",
			sortable: false,
			minWidth: 10,
		},
		{
			id: "bookId",
			numeric: false,
			disablePadding: false,
			label: "Book ID",
			sortable: false,
			minWidth: 10,
		},
		{
			id: "owner",
			numeric: false,
			disablePadding: false,
			label: "Owner",
			sortable: false,
			minWidth: 200,
		},
		{
			id: "rating",
			numeric: false,
			disablePadding: false,
			label: "Rating",
			sortable: false,
			minWidth: 20,
		},
		{
			id: "review",
			numeric: true,
			disablePadding: false,
			label: "Review",
			sortable: false,
			minWidth: 240,
		},
		{
			id: "creation",
			numeric: true,
			disablePadding: false,
			label: "Creation date",
			sortable: true,
			minWidth: 240,
		},
	];

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox"></TableCell>
				{headCells.map((headCell) => {
					if (headCell.sortable) {
						return (
							<TableCell sx={{ minWidth: headCell.minWidth }} key={headCell.id} align="left" padding={headCell.disablePadding ? "none" : "normal"} sortDirection={"desc"}>
								<TableSortLabel active={true} direction={"desc"}>
									{headCell.label}
									<Box component="span" sx={visuallyHidden}>
										{"sorted descending"}
									</Box>
								</TableSortLabel>
							</TableCell>
						);
					} else {
						return (
							<TableCell sx={{ minWidth: headCell.minWidth }} key={headCell.id} align="left" padding={headCell.disablePadding ? "none" : "normal"}>
								{headCell.label}
							</TableCell>
						);
					}
				})}
			</TableRow>
		</TableHead>
	);
};

export default ReviewsTableHeader;
