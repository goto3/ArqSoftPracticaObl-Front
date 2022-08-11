import * as http from "./httpService";
import * as Auth from "./authService";

export function getApiKey(orgName) {
	const token = Auth.getToken();
	return http.send("get", `organizations/${orgName}/apiKey`, {}, { Authorization: "Bearer " + token }, {});
}

export function refreshKey(orgName) {
	const token = Auth.getToken();
	return http.send("put", `organizations/${orgName}/apiKey`, {}, { Authorization: "Bearer " + token }, {});
}
