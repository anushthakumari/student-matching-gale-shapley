import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

import Loader from "../components/Loader";

import {
	fetch_details_by_user_id,
	insert_details,
} from "../schemas/details.schema";
import { get_creds } from "../utils/login.utils";
import eduction_specialisation from "../data/eduction_specialisation";
import country_list from "../data/country_list";

const defaultState = {
	fname: "John",
	lname: "Doe",
	gender: "Female",
	age: "12",
	height: "5",
	address: "a an adress",
	city: "nyc",
	state: "ny",
	country: "USA",
	zip: "78",
	college_name: "Uni",
	ed_level: "ug",
	ed_specs: "economics",
};

export default function Student() {
	const { id } = get_creds();

	const [isLoading, setisLoading] = useState(false);
	const [formState, setformState] = useState(defaultState);

	const handleChange = (e) => {
		setformState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handelSubmit = async (e) => {
		e.preventDefault();
		try {
			setisLoading(true);
			const d = {};
			for (const key in formState) {
				if (key === "prefs") {
					continue;
				}
				const val = formState[key];
				if (val && val.trim()) {
					d[key] = val;
				} else {
					alert(key + " is required!!");
					setisLoading(false);
					return;
				}
			}

			await insert_details(d, id);
		} catch (error) {
			console.log(error);
		} finally {
			setisLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				setisLoading(true);
				const dt = await fetch_details_by_user_id(id);

				if (!dt) {
					setformState(defaultState);
				}

				const { last_updated, ...det } = dt;

				setformState(det);
			} catch (error) {
			} finally {
				setisLoading();
			}
		})();
	}, [id]);

	return (
		<form onSubmit={handelSubmit}>
			<Loader open={isLoading} />
			<Typography variant="h6" gutterBottom>
				Your Details
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="firstName"
						name="fname"
						value={formState.fname}
						onChange={handleChange}
						label="First name"
						fullWidth
						autoComplete="given-name"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="lastName"
						name="lname"
						value={formState.lname}
						onChange={handleChange}
						label="Last name"
						fullWidth
						autoComplete="family-name"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControl variant="standard" fullWidth required>
						<InputLabel id="gender-label">Gender</InputLabel>
						<Select
							name="gender"
							value={formState.gender}
							onChange={handleChange}
							labelId="gender-label"
							id="gender"
							label="Gender">
							<MenuItem>Select Gender</MenuItem>
							<MenuItem value={"Male"}>Male</MenuItem>
							<MenuItem value={"Female"}>Female</MenuItem>
							{/* <MenuItem value={"rns"}>Rather Not Say</MenuItem> */}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						type="number"
						inputProps={{ max: 40 }}
						required
						id="age"
						name="age"
						value={formState.age}
						onChange={handleChange}
						label="Age"
						fullWidth
						autoComplete="age"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						type="number"
						value={formState.height}
						onChange={handleChange}
						inputProps={{ max: 10 }}
						required
						id="height"
						name="height"
						label="Height (Ft)"
						fullWidth
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						value={formState.address}
						onChange={handleChange}
						id="address1"
						name="address"
						label="Address line"
						fullWidth
						autoComplete="shipping address-line1"
						variant="standard"
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="city"
						name="city"
						value={formState.city}
						onChange={handleChange}
						label="City"
						fullWidth
						autoComplete="shipping address-level2"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						id="state"
						name="state"
						value={formState.state}
						onChange={handleChange}
						label="State/Province/Region"
						fullWidth
						variant="standard"
						required
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="zip"
						name="zip"
						type="number"
						value={formState.zip}
						onChange={handleChange}
						label="Zip / Postal code"
						fullWidth
						autoComplete="shipping postal-code"
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl variant="standard" fullWidth required>
						<InputLabel id="country-label">Country</InputLabel>
						<Select
							value={formState.country}
							onChange={handleChange}
							name="country"
							labelId="country-label"
							id="country"
							label="Education Level">
							{country_list.map((v, i) => (
								<MenuItem key={i} value={v}>
									{v}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			<Typography mt={"3rem"} variant="h6" gutterBottom>
				Education Details
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						required
						id="collegename"
						name="college_name"
						value={formState.college_name}
						onChange={handleChange}
						label="College Name/University"
						fullWidth
						variant="standard"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl variant="standard" fullWidth required>
						<InputLabel id="ed_level-label">Education Level</InputLabel>
						<Select
							value={formState.ed_level}
							onChange={handleChange}
							name="ed_level"
							labelId="ed_level-label"
							id="ed_level"
							label="Education Level">
							<MenuItem>Select Education Level</MenuItem>
							<MenuItem value={"Under Grad"}>Under Grad</MenuItem>
							<MenuItem value={"Post Grad"}>Post Grad</MenuItem>
							<MenuItem value={"Doctrate"}>Doctrate</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl variant="standard" fullWidth required>
						<InputLabel id="specialisation-label">Specialisation</InputLabel>
						<Select
							value={formState.ed_specs}
							onChange={handleChange}
							name="ed_specs"
							labelId="specialisation-label"
							id="specialisation"
							label="Specialisation">
							<MenuItem>Select</MenuItem>
							{eduction_specialisation.map((v, i) => (
								<MenuItem key={i} value={v.value}>
									{v.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item mt={"2rem"} sm={12}>
					<Button type="submit" variant="contained">
						Save
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}
