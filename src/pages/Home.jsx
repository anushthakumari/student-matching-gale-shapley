import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Loader from "../components/Loader";

import { get_creds } from "../utils/login.utils";
import {
	fetch_details_by_user_id,
	fetch_all_users_details,
} from "../schemas/details.schema";
import { fetch_prefs_by_id } from "../schemas/prefs.schema";

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

export default function CustomizedTables() {
	const navigate = useNavigate();
	const { id } = get_creds();

	const [matches, setmatches] = useState([]);
	const [isLoading, setisLoading] = useState(false);

	const handleView = (id) => {
		navigate("/partners/" + id);
	};

	useEffect(() => {
		(async () => {
			try {
				setisLoading(true);

				const user_data = await fetch_details_by_user_id(id);
				const pref_details = user_data.prefs;

				if (!pref_details) {
					alert("Please set your preferences and fill your details!");
					setisLoading(false);
					return;
				}

				const all_users = await fetch_all_users_details(user_data);

				// console.log(all_users);

				const potentialMatchesForUsers = findBestMatchesUsingGaleShapley(
					pref_details,
					all_users,
					id
					// all_users.filter((v) => v.doc_id !== id)
				);

				//removing logged in user
				setmatches(potentialMatchesForUsers);

				// setmatches(potentialMatchesForUsers[id]);
			} catch (error) {
				alert("Something went wrong!s");
				console.log(error);
			} finally {
				setisLoading();
			}
		})();
	}, [id]);

	return (
		<React.Fragment>
			<Loader open={isLoading} />
			<Typography mb={3} variant="h5">
				Based on your preference settings we have found following matches
			</Typography>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Name</StyledTableCell>
							<StyledTableCell align="right">Education Level</StyledTableCell>
							<StyledTableCell align="right">Specialisation</StyledTableCell>
							<StyledTableCell align="right">Country</StyledTableCell>
							<StyledTableCell align="right">View Details</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{matches.map((row) => (
							<StyledTableRow key={row.doc_id}>
								<StyledTableCell component="th" scope="row">
									{row.fname + " " + row.lname}
								</StyledTableCell>
								<StyledTableCell align="right">{row.ed_level}</StyledTableCell>
								<StyledTableCell align="right">{row.ed_specs}</StyledTableCell>
								<StyledTableCell align="right">{row.country}</StyledTableCell>
								<StyledTableCell align="right">
									<Button onClick={() => handleView(row.doc_id)}>View</Button>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</React.Fragment>
	);
}

const findBestMatchesUsingGaleShapley = (
	prefsArray,
	userList,
	currentUserDoc_id
) => {
	const menMatched = {};
	const womenMatched = {};
	const unmatchedMen = [...userList]; // Copy the userList

	while (unmatchedMen.length > 0) {
		const man = unmatchedMen.pop();
		const preferences = man.prefs.map((pref) => pref.key);

		for (const pref of preferences) {
			const potentialMatches = userList.filter((user) => {
				if (user.doc_id !== man.doc_id) {
					return user.prefs.some((p) => p.key === pref);
				}
				return false;
			});

			for (const woman of potentialMatches) {
				if (!womenMatched[woman.doc_id]) {
					menMatched[man.doc_id] = woman.doc_id;
					womenMatched[woman.doc_id] = man.doc_id;
					unmatchedMen.splice(unmatchedMen.indexOf(man), 1);
					break;
				} else {
					const currentMatch = womenMatched[woman.doc_id];
					const currentMatchIndex = woman.prefs.findIndex(
						(p) => p.key === currentMatch
					);
					const newMatchIndex = woman.prefs.findIndex(
						(p) => p.key === man.doc_id
					);
					if (newMatchIndex < currentMatchIndex) {
						menMatched[man.doc_id] = woman.doc_id;
						womenMatched[woman.doc_id] = man.doc_id;
						unmatchedMen.push(
							userList.find((user) => user.doc_id === currentMatch)
						);
						unmatchedMen.splice(unmatchedMen.indexOf(man), 1);
						break;
					}
				}
			}

			if (menMatched[man.doc_id]) {
				break;
			}
		}
	}

	const stableMatches = [];
	for (const manId in menMatched) {
		const womanId = menMatched[manId];
		const man = userList.find((user) => user.doc_id === manId);
		const woman = userList.find((user) => user.doc_id === womanId);
		stableMatches.push({
			man: man,
			woman: woman,
		});
	}

	const best_match_pair = stableMatches.filter(
		(v) => v.man.doc_id === currentUserDoc_id
	)[0];

	let best_match_for_user;

	if (best_match_pair.man.doc_id === currentUserDoc_id) {
		best_match_for_user = best_match_pair.woman;
	} else {
		best_match_for_user = best_match_pair.man;
	}

	// finding other least prefered matches
	const preferenceLookup = creatLookup(prefsArray);

	const matches = [];
	const otherUsers = userList.filter(
		(v) => v.doc_id !== best_match_for_user.doc_id
	);

	for (const key in preferenceLookup) {
		const numVal = preferenceLookup[key];
		for (const user of otherUsers) {
			if (!user.prefs) {
				continue;
			}

			const ulookup = creatLookup(user.prefs);

			if (ulookup[key] === numVal) {
				const index = matches.findIndex((m) => m.doc_id === user.doc_id);

				if (index > -1) {
					let v = { ...matches[index] };
					matches[index] = { ...v, score: v.score + numVal };
				} else {
					matches.push({ ...user, score: numVal });
				}
			}
		}
	}

	const sortedmt = matches
		.filter((v) => v.doc_id !== currentUserDoc_id)
		.sort((a, b) => b.score - a.score);

	sortedmt.unshift(best_match_for_user);

	return sortedmt;
};

function creatLookup(prefs = []) {
	const preferenceLookup = {};

	let num_to_multiply = prefs.length;
	prefs.forEach((pref, i) => {
		preferenceLookup[pref.key] = pref.value ? num_to_multiply * 2 : 0;
		num_to_multiply = num_to_multiply - 1;
	});

	return preferenceLookup;
}
