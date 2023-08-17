import React from "react";

import Partners from "../pages/Partners";
import Sidebar from "../components/Sidebar";

const StudyPartners = () => {
	return (
		<Sidebar activeTabIndex={3} title="Study Partners">
			<Partners />
		</Sidebar>
	);
};

export default StudyPartners;
