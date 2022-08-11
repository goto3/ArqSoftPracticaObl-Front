import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import OrganizationCard from "../components/organization/OrganizationCard";

import * as OrganizationService from "../services/organizationService";

const Organizations = () => {
	const navigate = useNavigate();
	const [organizations, setOrganizations] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const data = await OrganizationService.getUserOrganizations();
				data ? setOrganizations(data) : setOrganizations([]);
			} catch (err) {
				if (err.response && err.response.status === 403) {
					navigate("/403", { replace: true });
				}
			}
		})();
	}, []);

	return (
		<>
			<Helmet>
				<title>My organizations</title>
			</Helmet>

			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100%",
					py: 3,
				}}>
				<Container maxWidth={false}>
					<Box sx={{ pt: 0 }}>
						<Grid container spacing={3}>
							{organizations.map((org) => (
								<Grid item key={org.OrganizationName} lg={4} md={6} xs={12}>
									<OrganizationCard organization={org} />
								</Grid>
							))}
						</Grid>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Organizations;
