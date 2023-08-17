export const getgender = (gender) => {
	if (gender === "m") {
		return "Male";
	}

	if (gender === "f") {
		return "Female";
	}

	if (gender === "rns") {
		return "Rather Not Say";
	}
};
export const getedlevel = (level) => {
	if (level === "ug") {
		return "Under Grad";
	}

	if (level === "pg") {
		return "Post Grad";
	}

	if (level === "dt") {
		return "Doctrate";
	}
};
