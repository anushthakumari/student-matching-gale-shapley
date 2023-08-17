import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	Box,
	Typography,
	Divider,
	Grid,
	Avatar,
	Chip,
	Button,
} from "@mui/material";

import Loader from "../components/Loader";

import { fetch_details_by_user_id } from "../schemas/details.schema";
import {
	already_requested,
	make_request,
	delete_request,
} from "../schemas/request.schema";
import {
	insert_partners,
	is_already_partner,
} from "../schemas/partners.schema";
import { get_creds } from "../utils/login.utils";

const PartnerDetails = () => {
	const { id } = get_creds();
	const { id: user_id } = useParams();

	const [isLoading, setisLoading] = useState(false);
	const [user, setuser] = useState({});
	const [req_data, setreq_data] = useState(null);
	const [status, setstatus] = useState("");
	const [show_accept_btn, setshow_accept_btn] = useState(false);
	const [show_request_btn, setshow_request_btn] = useState(false);

	const accept_request = async () => {
		try {
			setisLoading(true);
			await delete_request(req_data.doc_id);
			const { doc_id, ...req } = req_data;
			await insert_partners(req);
			alert("Accepted!");
			setstatus("accepted");
			setshow_accept_btn(false);
		} catch (error) {
			alert("Something went wrong!");
		} finally {
			setisLoading(false);
		}
	};

	const request_match = async () => {
		try {
			setisLoading(true);

			if (req_data) {
				alert("Already Requested!");
				return false;
			}
			await make_request(id, user_id);
			setshow_request_btn(false);
			alert("Request Submitted!");
		} catch (error) {
			alert("something went wrong!");
		} finally {
			setisLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				setisLoading(true);
				const dt = await fetch_details_by_user_id(user_id);
				const already_requested_data = await already_requested(user_id, id);

				if (already_requested_data) {
					setreq_data(already_requested_data);
					if (already_requested_data.from_user_id === id) {
						setstatus("pending");
					} else {
						setshow_accept_btn(true);
					}
				}

				const is_partner = await is_already_partner(id, user_id);

				if (is_partner) {
					setstatus("partner");
				}

				if (!is_partner && !already_requested_data) {
					setshow_request_btn(true);
				}

				if (dt) {
					setuser(dt);
				}
			} catch (error) {
			} finally {
				setisLoading();
			}
		})();
	}, [id, user_id]);

	if (isLoading) {
		return <Loader open={true} />;
	}

	if (!user) {
		return (
			<Box h="100%">
				<Typography variant="h5" mb={2}>
					No Data Found
				</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<Box m={2} display="flex" flexDirection="column" alignItems="center">
					<Avatar
						src={user.profileImage}
						alt={user.fname}
						sx={{ width: 120, height: 120 }}
					/>
					<Box
						mt={2}
						flexDirection={"column"}
						display={"flex"}
						alignItems={"center"}>
						<Typography variant="h4">
							{user.fname + " " + user.lname}
						</Typography>

						{show_accept_btn ? (
							<Button variant="contained" onClick={() => accept_request()}>
								Accept
							</Button>
						) : null}
						{show_request_btn ? (
							<Button variant="contained" onClick={request_match}>
								Send Request
							</Button>
						) : null}

						{status ? <Chip label={status} /> : ""}
					</Box>
				</Box>
			</Grid>

			<Grid
				item
				xs={12}
				display={"flex"}
				flexDirection={"column"}
				gap={"1rem"}
				md={8}>
				<Box m={2}>
					<Typography variant="h5" mb={2}>
						Personal Details
					</Typography>
					<Typography variant="subtitle1">Gender: {user.gender}</Typography>
					<Typography variant="subtitle1">Age: {user.age}</Typography>
					<Typography variant="subtitle1">Height: {user.height}ft</Typography>
					<Typography variant="subtitle1">Address: {user.address}</Typography>
					<Typography variant="subtitle1">City: {user.city}</Typography>
					<Typography variant="subtitle1">State: {user.state}</Typography>
					<Typography variant="subtitle1">Zipcoe: {user.zip}</Typography>
					<Typography variant="subtitle1">Country: {user.country}</Typography>
					<Divider />
				</Box>

				<Box m={2}>
					<Typography variant="h5" mb={2}>
						Educational Details
					</Typography>
					<Typography variant="subtitle1">
						College/University: {user.college_name}
					</Typography>
					<Typography variant="subtitle1">
						Specialisation: {user.ed_specs}
					</Typography>
					<Typography variant="subtitle1">
						Education Level: {user.ed_level}
					</Typography>
					<Divider />
				</Box>

				<Box m={2}>
					<Typography variant="h5" mb={2}>
						Personality Traits
					</Typography>
					{user?.prefs?.map((v, i) => (
						<Typography key={i} variant="subtitle1">
							{v.lable}: {v.value ? "Yes" : "No"}
						</Typography>
					))}
					<Divider />
				</Box>
			</Grid>
		</Grid>
	);
};

export default PartnerDetails;
