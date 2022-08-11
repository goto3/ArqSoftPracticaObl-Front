import * as http from "./httpService";
import * as Auth from "./authService";
import * as OrganizationService from "./organizationService";

export async function postBook(data) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send(
		"post",
		`books`,
		{ organization: OrganizationName, isbn: data.isbn, title: data.title, authors: data.authors, year: data.year, copiesAmount: data.copiesAmount },
		{ Authorization: "Bearer " + token },
		{}
	);
}

export async function editBook(id, data) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send(
		"put",
		`books/${id}`,
		{ organization: OrganizationName, isbn: data.isbn, title: data.title, authors: data.authors, year: data.year, copiesAmount: data.copiesAmount },
		{ Authorization: "Bearer " + token },
		{}
	);
}

export async function deleteBook(id) {
	const token = Auth.getToken();
	return http.send("delete", `books/${id}`, {}, { Authorization: "Bearer " + token }, {});
}

export async function getBook(isbn) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send("get", `organizations/${OrganizationName}/books/${isbn}`, {}, { Authorization: "Bearer " + token }, {});
}

export function getAllBooks(textSearch, page, limit, order) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send("get", `books`, {}, { Authorization: "Bearer " + token }, { organization: OrganizationName, page, limit, textSearch, order });
}
