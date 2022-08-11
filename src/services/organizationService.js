import * as http from "./httpService";
import * as Auth from "./authService";

const organizationsKey = "organizations";
const selectedOrgIndexKey = "selectedOrganizationIndex";

export async function postOrganization(data) {
	const res = await http.send("post", "organizations", { name: data.orgName, userName: data.userName, email: data.email, password: data.password }, {}, {});
	await Auth.loginWithJWT(res.data.token);
}

export async function setUserOrganizations(organizations) {
	localStorage.setItem(organizationsKey, JSON.stringify(organizations));
	return organizations;
}

export function getUserOrganizations() {
	return JSON.parse(localStorage.getItem(organizationsKey));
}

export function setSelectedOrganization(index) {
	localStorage.setItem(selectedOrgIndexKey, index);
}

export function getSelectedOrganizationIndex() {
	return localStorage.getItem(selectedOrgIndexKey);
}

export function getSelectedOrganizationData() {
	const index = localStorage.getItem(selectedOrgIndexKey);
	return getUserOrganizations()[index];
}

export function getSelectedOrganizationPermission() {
	const index = localStorage.getItem(selectedOrgIndexKey);
	return getUserOrganizations()[index].permission;
}
