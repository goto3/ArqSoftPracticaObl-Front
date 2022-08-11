import * as http from "./httpService";
import * as Auth from "./authService";
import * as OrganizationService from "./organizationService";

export async function postReview(bookId, data) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send("post", `reviews`, { organization: OrganizationName, bookId: parseInt(bookId), rating: data.rating, review: data.review }, { Authorization: "Bearer " + token }, {});
}

export async function deleteReview(id) {
	const token = Auth.getToken();
	return http.send("delete", `reviews/${id}`, {}, { Authorization: "Bearer " + token }, {});
}

export async function getReviews(bookId, own, page = 1, limit = 10) {
	const token = Auth.getToken();
	const { OrganizationName } = OrganizationService.getSelectedOrganizationData();
	return http.send("get", `reviews`, {}, { Authorization: "Bearer " + token }, { organization: OrganizationName, bookId, own, page, limit });
}
