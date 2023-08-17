import { useState, forwardRef, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import bg from "./bg/signin.svg";
import bgimg from "./bg/backimg.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

import { fetch_user_by_email, insert_user } from "../schemas/users.schema";
import { set_creds, get_creds } from "../utils/login.utils";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const boxstyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "75%",
	height: "70%",
	bgcolor: "background.paper",
	boxShadow: 24,
};

const center = {
	position: "relative",
	top: "50%",
	left: "30%",
};

export default function Register() {
	const [isLoading, setisLoading] = useState(false);
	const [errSate, seterrSate] = useState({
		isOpen: false,
		msg: "",
	});
	const [formState, setformState] = useState({
		email: "",
		pass: "",
		cpass: "",
	});
	const vertical = "top";
	const horizontal = "right";
	const navigate = useNavigate();

	const handleChange = (e) => {
		setformState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (event) => {
		try {
			setisLoading(true);
			event.preventDefault();

			const email = formState.email.trim();
			const pass = formState.pass.trim();
			const cpass = formState.cpass.trim();

			if (pass !== cpass) {
				seterrSate({ msg: "Passwords do not match!", isOpen: true });
				setisLoading(false);
				return;
			}

			const user = await fetch_user_by_email(email);

			if (user) {
				seterrSate({
					msg: "User with this email already exists!",
					isOpen: true,
				});
				setisLoading(false);
				return;
			}

			const user_id = await insert_user(email, pass);
			set_creds(email, user_id);

			navigate("/");
		} catch (error) {
			console.log(error);

			seterrSate({
				msg: "Something went wrong!",
				isOpen: true,
			});
		} finally {
			setisLoading(false);
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		seterrSate({
			isOpen: false,
			msg: "",
		});
	};

	function TransitionLeft(props) {
		return <Slide {...props} direction="left" />;
	}

	useEffect(() => {
		const logged_data = get_creds();
		if (logged_data) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<>
			<Snackbar
				open={errSate.isOpen}
				autoHideDuration={3000}
				onClose={handleClose}
				TransitionComponent={TransitionLeft}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
					{errSate.msg}
				</Alert>
			</Snackbar>
			<div
				style={{
					backgroundImage: `url(${bgimg})`,
					backgroundSize: "cover",
					height: "100vh",
					color: "#f5f5f5",
				}}>
				<Box sx={boxstyle}>
					<Grid container>
						<Grid item xs={12} sm={12} lg={6}>
							<Box
								style={{
									backgroundImage: `url(${bg})`,
									backgroundSize: "cover",
									marginTop: "40px",
									marginLeft: "15px",
									marginRight: "15px",
									height: "63vh",
									color: "#f5f5f5",
								}}></Box>
						</Grid>
						<Grid item xs={12} sm={12} lg={6}>
							<Box
								style={{
									backgroundSize: "cover",
									height: "70vh",
									minHeight: "500px",
									backgroundColor: "#3b33d5",
								}}>
								<ThemeProvider theme={darkTheme}>
									<Container>
										<Box height={35} />
										<Box sx={center}>
											<Avatar
												sx={{ ml: "85px", mb: "4px", bgcolor: "#ffffff" }}>
												<LockOutlinedIcon />
											</Avatar>
											<Typography component="h1" variant="h4">
												Create Account
											</Typography>
										</Box>
										<Box
											component="form"
											onSubmit={handleSubmit}
											sx={{ mt: 2 }}>
											<Grid container spacing={1}>
												<Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
													<TextField
														required
														fullWidth
														id="email"
														label="Email"
														name="email"
														onChange={handleChange}
														type="email"
														autoComplete="email"
													/>
												</Grid>
												<Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
													<TextField
														required
														fullWidth
														name="pass"
														label="Password"
														type="password"
														id="password"
														onChange={handleChange}
														autoComplete="new-password"
													/>
												</Grid>
												<Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
													<TextField
														required
														fullWidth
														name="cpass"
														label="Confirm Password"
														type="password"
														id="confirmpassword"
														onChange={handleChange}
														autoComplete="new-password"
													/>
												</Grid>
												<Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
													<Button
														type="submit"
														variant="contained"
														fullWidth="true"
														size="large"
														disabled={isLoading}
														sx={{
															mt: "15px",
															mr: "20px",
															borderRadius: 28,
															color: "#ffffff",
															minWidth: "170px",
															backgroundColor: "#FF9A01",
														}}>
														{isLoading ? "Loading.." : "Register"}
													</Button>
												</Grid>
												<Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
													<Stack direction="row" spacing={2}>
														<Typography
															variant="body1"
															component="span"
															style={{ marginTop: "10px" }}>
															Already have an Account?{" "}
															<span
																style={{ color: "#beb4fb", cursor: "pointer" }}
																onClick={() => {
																	navigate("/login");
																}}>
																Sign In
															</span>
														</Typography>
													</Stack>
												</Grid>
											</Grid>
										</Box>
									</Container>
								</ThemeProvider>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</div>
		</>
	);
}
