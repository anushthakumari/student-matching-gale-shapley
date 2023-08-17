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

import { fetch_user_by_email } from "../schemas/users.schema";
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
	left: "37%",
};

const vertical = "top";
const horizontal = "right";

export default function Login() {
	const [isLoading, setisLoading] = useState(false);
	const [formState, setformState] = useState({
		email: "",
		pass: "",
	});
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setisLoading(true);
			const email = formState.email.trim();
			const pass = formState.pass.trim();
			const user = await fetch_user_by_email(email);

			if (!user) {
				setOpen(true);
				setisLoading(false);
				return;
			}

			if (user.pass !== pass) {
				setOpen(true);
				setisLoading(false);
				return;
			}

			set_creds(user.email, user.doc_id);
			navigate("/");
		} catch (error) {
			alert("something went wrong!!");
			console.log(error);
		} finally {
			setisLoading(false);
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	const handleChange = (e) => {
		setformState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				TransitionComponent={TransitionLeft}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
					Failed! Enter correct username and password.
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
												sx={{ ml: "35px", mb: "4px", bgcolor: "#ffffff" }}>
												<LockOutlinedIcon />
											</Avatar>
											<Typography component="h1" variant="h4">
												Sign In
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
														type="email"
														fullWidth
														id="email"
														label="Email"
														name="email"
														onChange={handleChange}
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
												{/* <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                          <Stack direction="row" spacing={2}>
                            <FormControlLabel
                              sx={{ width: "60%" }}
                              onClick={() => setRemember(!remember)}
                              control={<Checkbox checked={remember} />}
                              label="Remember me"
                            />
                            <Typography
                              variant="body1"
                              component="span"
                              onClick={() => {
                                navigate("/reset-password");
                              }}
                              style={{ marginTop: "10px", cursor: "pointer" }}
                            >
                              Forgot password?
                            </Typography>
                          </Stack>
                        </Grid> */}
												<Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
													<Button
														type="submit"
														variant="contained"
														fullWidth="true"
														size="large"
														disabled={isLoading}
														sx={{
															mt: "10px",
															mr: "20px",
															borderRadius: 28,
															color: "#ffffff",
															minWidth: "170px",
															backgroundColor: "#FF9A01",
														}}>
														{isLoading ? "Loading.." : "Sign In"}
													</Button>
												</Grid>
												<Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
													<Stack direction="row" spacing={2}>
														<Typography
															variant="body1"
															component="span"
															style={{ marginTop: "10px" }}>
															Not registered yet?{" "}
															<span
																style={{ color: "#beb4fb", cursor: "pointer" }}
																onClick={() => {
																	navigate("/register");
																}}>
																Create an Account
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
