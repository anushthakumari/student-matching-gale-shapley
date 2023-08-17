import * as React from "react";

import Sidebar from "../components/Sidebar";
import Student from "../pages/Student";

export default function StudentDetails() {
	return (
		<Sidebar activeTabIndex={1} title="Student Details">
			<Student />
		</Sidebar>
	);
}
