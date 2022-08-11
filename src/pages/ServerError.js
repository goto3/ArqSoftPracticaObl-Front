import { Helmet } from "react-helmet";
import { Box, Container, Typography } from "@material-ui/core";

const ServerError = () => (
	<>
		<Helmet>
			<title>Error 500 - Internal Server Error</title>
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
					500: Something went wrong!
				</Typography>
				<Typography align="center" color="textPrimary" variant="subtitle2">
					Could not connect to backend services. We are working on it.
				</Typography>
				<Box sx={{ textAlign: "center" }}>
					<img
						alt="Under development"
						src="/static/images/500.jpg"
						style={{
							marginTop: 50,
							display: "inline-block",
							maxWidth: "100%",
							width: 560,
						}}
					/>
				</Box>
			</Container>
		</Box>
	</>
);

export default ServerError;
