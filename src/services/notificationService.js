import * as http from "./httpService";
import * as Auth from "./authService";
import * as OrgService from "./organizationService";

export async function getNotificationStatus() {
	const token = Auth.getToken();
	const organization = OrgService.getSelectedOrganizationData().OrganizationName;
	return await http.send("get", `notifications`, {}, { Authorization: "Bearer " + token }, { organization });
}

export async function setNotificationStatus() {
	const token = Auth.getToken();
	const organization = OrgService.getSelectedOrganizationData().OrganizationName;
	return await http.send("patch", `notifications`, {}, { Authorization: "Bearer " + token }, { organization });
}
