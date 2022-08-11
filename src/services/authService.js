import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import * as http from "./httpService";
import * as OrganizationService from "./organizationService";

const tokenKey = "token";
const organizationKey = "organizations";
const selectedOrgKey = "selectedOrganizationIndex";

export async function login(credentials) {
	const { token } = (await http.send("post", "auth", { email: credentials.email, password: credentials.password }, {}, {})).data;
	localStorage.setItem(tokenKey, token);
	const { organizations } = jwt.decode(token);
	await OrganizationService.setUserOrganizations(organizations);
	OrganizationService.setSelectedOrganization(0);
}

export async function loginWithJWT(token) {
	localStorage.setItem(tokenKey, token);
	const { organizations } = jwt.decode(token);
	await OrganizationService.setUserOrganizations(organizations);
	OrganizationService.setSelectedOrganization(0);
}

export function getCurrentUser() {
	try {
		const token = localStorage.getItem(tokenKey);
		return jwtDecode(token);
	} catch (err) {
		return null;
	}
}

export function getToken() {
	return localStorage.getItem(tokenKey);
}

export function logout() {
	localStorage.removeItem(tokenKey);
	localStorage.removeItem(organizationKey);
	localStorage.removeItem(selectedOrgKey);
}
