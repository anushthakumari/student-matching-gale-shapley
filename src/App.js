import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Match from "./layouts/Match.layout";
import StudentDetails from "./layouts/StudentDetails";
import Prefs from "./layouts/Prefs";
import StudyPartners from "./layouts/StudyPartners.layout";
import PartnerDetails from "./layouts/PartnerDetails.layout";

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/login" exact element={<Login />} />
					<Route path="/register" exact element={<Register />} />
					<Route path="/reset-password" exact element={<ForgotPassword />} />

					<Route path="/">
						<Route
							path="/match"
							exact
							element={
								<PrivateRoute>
									<Match />
								</PrivateRoute>
							}
						/>
						<Route
							path="/"
							exact
							element={
								<PrivateRoute>
									<StudentDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/prefs"
							exact
							element={
								<PrivateRoute>
									<Prefs />
								</PrivateRoute>
							}
						/>
						<Route
							path="/partners"
							exact
							element={
								<PrivateRoute>
									<StudyPartners />
								</PrivateRoute>
							}
						/>
						<Route
							path="/partners/:id"
							exact
							element={
								<PrivateRoute>
									<PartnerDetails />
								</PrivateRoute>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}
