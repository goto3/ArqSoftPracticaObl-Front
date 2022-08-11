import { Helmet } from "react-helmet";
import { Box, Container, Typography } from "@material-ui/core";

const Forbidden = () => (
	<>
		<Helmet>
			<title>Error 403 - Forbidden</title>
		</Helmet>
		<Box
			sx={{
				backgroundColor: "background.default",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "center",
			}}>
			<Container maxWidth="md">
				<Typography align="center" color="textPrimary" variant="h1">
					403: You are not authorized to view this page
				</Typography>
				<Typography align="center" color="textPrimary" variant="subtitle2">
					You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
				</Typography>
			</Container>
		</Box>
	</>
);

export default Forbidden;
