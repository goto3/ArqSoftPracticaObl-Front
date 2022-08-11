import { useContext } from "react";
import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core";
import { visuallyHidden } from "@material-ui/utils";

import OrgReservationContext from "../../context/orgReservationContext";

const OrgReservationHeader = () => {
	const { orderBy, order, handleSort } = useContext(OrgReservationContext);

	const headCells = [
		{
			id: "checkbox",
			numeric: false,
			disablePadding: false,
			label: "",
		},
		{
			id: "id",
			numeric: false,
			disablePadding: false,
			label: "ID",
		},
		{
			id: "isbn",
			numeric: false,
			disablePadding: false,
			label: "ISBN",
		},
		{
			id: "title",
			numeric: false,
			disablePadding: false,
			label: "Ttle",
		},
		{
			id: "startDate",
			numeric: false,
			disablePadding: false,
			label: "Start date",
		},
		{
			id: "endDate",
			numeric: false,
			disablePadding: false,
			label: "End date",
		},
		{
			id: "status",
			numeric: false,
			disablePadding: false,
			label: "Status",
		},
	];

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => {
					if (headCell.id === "endDate") {
						return (
							<TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? "none" : "normal"} sortDirection={"desc"}>
								<TableSortLabel active={true} direction={orderBy === headCell.id ? order : "desc"}>
									{headCell.label}
									<Box component="span" sx={visuallyHidden}>
										{"sorted descending"}
									</Box>
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

export default OrgReservationHeader;
