import { Navigate } from "react-router-dom";
import * as AuthService from "../../services/authService";
import * as OrgService from "../../services/organizationService";

const LoggedInGuard = ({ page: Page, permission }) => {
	function canNavigate() {
		const user = AuthService.getCurrentUser();
		if (!user) return false;
		if (permission) {
			return OrgService.getSelectedOrganizationPermission() === permission;
		} else {
			return true;
		}
	}

	return <>{canNavigate() ? <Page /> : <Navigate to="/app/403" />}</>;
};

export default LoggedInGuard;
