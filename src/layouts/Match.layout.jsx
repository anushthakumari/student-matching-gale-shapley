import React from "react";

import Sidebar from "../components/Sidebar";
import Home from "../pages/Home";

const Match = () => {
	return (
		<Sidebar activeTabIndex={0} title="Suggested Matches">
			<Home />
		</Sidebar>
	);
};

export default Match;
