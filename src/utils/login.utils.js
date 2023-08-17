export const keys = {
	USER: "student:user",
};

export const get_creds = () => {
	const json = localStorage.getItem(keys.USER);
	if (json) {
		return JSON.parse(json);
	}

	return null;
};

export const set_creds = (email, id) => {
	localStorage.setItem(keys.USER, JSON.stringify({ email, id }));
};
export const remove_creds = () => {
	localStorage.removeItem(keys.USER);
};
