import React from "react";

import Sidebar from "../components/Sidebar";
import PartnerDetails from "../pages/PartnerDetails";

const user = {
	fname: "John",
	lname: "Doe",
	gender: "m",
	age: "20",
	height: "7",
	address: "123 Main Street, City, State",
	city: "New York City",
	state: "New York",
	country: "America",
	zip: 909,
	college_name: "University",
	ed_level: "ug",
	ed_specs: "economics",
};

const PartnerDetailsLayout = () => {
	return (
		<Sidebar activeTabIndex={3} title="Study Partners / Partner Details">
			<PartnerDetails user={user} />
		</Sidebar>
	);
};

export default PartnerDetailsLayout;
