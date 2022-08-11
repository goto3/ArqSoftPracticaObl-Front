import Axios from "axios";

const API_IP = process.env.REACT_APP_API_IP || "http://localhost:4300/api/";

export const send = (method, resource, data, headers, params) => {
	return Axios({
		method,
		url: API_IP + resource,
		data,
		headers,
		params,
	});
};
