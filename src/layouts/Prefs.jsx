import React from "react";

import Sidebar from "../components/Sidebar";
import PrefsPage from "../pages/Prefs";

const Prefs = () => {
	return (
		<Sidebar activeTabIndex={2} title="Preference Settings">
			<PrefsPage />
		</Sidebar>
	);
};

export default Prefs;
