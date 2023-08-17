import * as React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { remove_creds } from "../utils/login.utils";

const drawerWidth = 240;

function Sidebar(props) {
	const { window, children, title, activeTabIndex = 0 } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleLogout = () => {
		remove_creds();
		navigate("/login");
	};

	const drawer = (
		<div>
			<Toolbar>
				<Stack direction="row" spacing={2}>
					<JoinLeftIcon />
					<Typography>Matching</Typography>
				</Stack>
			</Toolbar>

			<Divider />
			<List>
				<Link style={{ textDecoration: "none", color: "#000" }} to="/">
					<ListItem
						sx={{ bgcolor: activeTabIndex === 1 ? "grey" : null }}
						disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<InfoIcon />
							</ListItemIcon>
							<ListItemText primary={"Details"} />
						</ListItemButton>
					</ListItem>
				</Link>
				<Link style={{ textDecoration: "none", color: "#000" }} to="/match">
					<ListItem
						sx={{ bgcolor: activeTabIndex === 0 ? "grey" : null }}
						disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<ShareIcon />
							</ListItemIcon>
							<ListItemText primary={"Find Match"} />
						</ListItemButton>
					</ListItem>
				</Link>

				<Link style={{ textDecoration: "none", color: "#000" }} to="/prefs">
					<ListItem
						sx={{ bgcolor: activeTabIndex === 2 ? "grey" : null }}
						disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary={"Preference Settings"} />
						</ListItemButton>
					</ListItem>
				</Link>
				<Link style={{ textDecoration: "none", color: "#000" }} to="/partners">
					<ListItem
						sx={{ bgcolor: activeTabIndex === 3 ? "grey" : null }}
						disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<FormatListBulletedIcon />
							</ListItemIcon>
							<ListItemText primary={"Study Partners"} />
						</ListItemButton>
					</ListItem>
				</Link>
				<ListItem
					sx={{ bgcolor: activeTabIndex === 3 ? "grey" : null }}
					disablePadding>
					<ListItemButton onClick={handleLogout}>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary={"Logout"} />
					</ListItemButton>
				</ListItem>
			</List>
			{/* <Divider /> */}
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}>
				<Toolbar>
					<Typography>{title}</Typography>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}

Sidebar.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default Sidebar;
