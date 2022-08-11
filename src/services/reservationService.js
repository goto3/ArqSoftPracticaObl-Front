import * as http from "./httpService";
import * as Auth from "./authService";
import * as OrgService from "./organizationService";

export async function fetchReservations(filter) {
	const token = Auth.getToken();
	const organization = OrgService.getSelectedOrganizationData().OrganizationName;
	filter = filter.join(",");
	return await http.send("get", `reservations`, {}, { Authorization: "Bearer " + token }, { organization, filter });
}

export function postReservation(id, startDate) {
	const token = Auth.getToken();
	return http.send("post", `books/${id}/reservations`, { startDate }, { Authorization: "Bearer " + token }, {});
}

export async function returnBook(id) {
	const token = Auth.getToken();
	await http.send("patch", `reservations/${id}`, {}, { Authorization: "Bearer " + token }, {});
}
