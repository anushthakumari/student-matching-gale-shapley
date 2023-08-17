import { Navigate } from "react-router-dom";

import { get_creds } from "../utils/login.utils";

function PrivateRoute({ children }) {
	const auth = get_creds();
	return auth ? <>{children}</> : <Navigate to="/login" />;
}

export default PrivateRoute;
