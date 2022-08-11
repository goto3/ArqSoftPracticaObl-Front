import * as http from "./httpService";
import * as Auth from "./authService";

export function sendInvite(email, permission, organization) {
	const token = Auth.getToken();
	return http.send("post", "invites", { email, organization, permission }, { Authorization: "Bearer " + token }, {});
}

export function getInvite(hash) {
	return http.send("get", "invites/" + hash, {}, {}, {});
}

export async function deleteInvite(hash, email) {
	const token = Auth.getToken();
	const res = await http.send("delete", "invites/" + hash, {}, { Authorization: "Bearer " + token }, { email });
	await Auth.loginWithJWT(res.data.token);
}
