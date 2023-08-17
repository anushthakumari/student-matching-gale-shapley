import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import {
	fetch_user_request,
	fetch_user_make_request,
} from "../schemas/request.schema";
import { fetch_partners } from "../schemas/partners.schema";
import { get_creds } from "../utils/login.utils";
import { Typography } from "@mui/material";
import Loader from "../components/Loader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

const rows = [
	createData("John Doe", "Albuquerque", "New Mexico", "pending", 4.0),
	createData("Amy Santiago", "Albuquerque", "New Mexico", "pending", 4.0),
	createData("Josh Ronalds", "Albuquerque", "New Mexico", "pending", 4.0),
	createData("Walter White", "Albuquerque", "New Mexico", "pending", 4.0),
	createData("Jessy Pinkman", "Albuquerque", "New Mexico", "pending", 4.0),
];

export default function CustomizedTables() {
	const navigate = useNavigate();
	const { id } = get_creds();

	const [reuests, setreuests] = useState([]);
	const [pending_requests, setpending_requests] = useState([]);
	const [partners, setpartners] = useState([]);
	const [isLoading, setisLoading] = useState(false);

	const handleView = (id) => {
		navigate("/partners/" + id);
	};

	useEffect(() => {
		(async () => {
			try {
				setisLoading(true);
				const reqs = await fetch_user_request(id);
				const p_requs = await fetch_user_make_request(id);
				const parts = await fetch_partners(id);
				setreuests(reqs);
				setpending_requests(p_requs);
				setpartners(parts);
			} catch (error) {
				alert("Something went wrong!");
				console.log(error);
			} finally {
				setisLoading(false);
			}
		})();
	}, [id]);

	if (isLoading) {
		return <Loader open={true} />;
	}

	if (!reuests.length && !pending_requests.length && !partners.length) {
		return <center>No Data</center>;
	}

	return (
		<React.Fragment>
			{reuests.length ? (
				<TableContainer component={Paper}>
					<Typography variant="h4">Awaiting Requests</Typography>
					<Table sx={{ minWidth: 700 }} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Request Id</StyledTableCell>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell align="right">State</StyledTableCell>
								<StyledTableCell align="right">City</StyledTableCell>
								<StyledTableCell align="right">View Details</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{reuests.map((row) => (
								<StyledTableRow key={row.doc_id}>
									<StyledTableCell component="th" scope="row">
										{row.doc_id}
									</StyledTableCell>
									<StyledTableCell component="th" scope="row">
										{row.user_data.fname} {row.user_data?.lname}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.state}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.city}
									</StyledTableCell>
									<StyledTableCell align="right">
										<Button onClick={() => handleView(row.from_user_id)}>
											View
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : null}

			{pending_requests.length ? (
				<TableContainer component={Paper}>
					<Typography variant="h4">Pending Requests</Typography>
					<Table sx={{ minWidth: 700 }} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Request Id</StyledTableCell>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell align="right">State</StyledTableCell>
								<StyledTableCell align="right">City</StyledTableCell>
								<StyledTableCell align="right">View Details</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{pending_requests.map((row) => (
								<StyledTableRow key={row.doc_id}>
									<StyledTableCell component="th" scope="row">
										{row.doc_id}
									</StyledTableCell>
									<StyledTableCell component="th" scope="row">
										{row.user_data.fname} {row.user_data?.lname}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.state}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.city}
									</StyledTableCell>
									<StyledTableCell align="right">
										<Button onClick={() => handleView(row.to_user_id)}>
											View
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : null}

			{partners.length ? (
				<TableContainer component={Paper}>
					<Typography variant="h4">Study Partners</Typography>
					<Table sx={{ minWidth: 700 }} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell align="right">State</StyledTableCell>
								<StyledTableCell align="right">City</StyledTableCell>
								<StyledTableCell align="right">View Details</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{partners.map((row) => (
								<StyledTableRow key={row.doc_id}>
									<StyledTableCell component="th" scope="row">
										{row.user_data.fname} {row.user_data?.lname}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.state}
									</StyledTableCell>
									<StyledTableCell align="right">
										{row.user_data.city}
									</StyledTableCell>
									<StyledTableCell align="right">
										<Button onClick={() => handleView(row.user_data.doc_id)}>
											View
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : null}
		</React.Fragment>
	);
}
