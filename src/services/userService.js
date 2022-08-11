import * as http from "./httpService";

export function postUser(data, inviteId) {
	return http.send("post", "users", { userName: data.name, email: data.email, password: data.password }, {}, { inviteId: inviteId });
}
