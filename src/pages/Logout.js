import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";

import * as Auth from "../services/authService";

const Logout = () => {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	useEffect(() => {
		(async () => {
			Auth.logout();
			await userContext.handleLoginLogout();
			navigate("/app/login", { replace: true });
		})();
	}, []);

	return <></>;
};

export default Logout;
