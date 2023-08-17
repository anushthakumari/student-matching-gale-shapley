import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import {
	Button,
	Stack,
	Typography,
	FormControlLabel,
	Checkbox,
} from "@mui/material";

import Loader from "../components/Loader";

import {
	fetch_details_by_user_id,
	insert_details,
} from "../schemas/details.schema";
import { get_creds } from "../utils/login.utils";

const Prefs = () => {
	const { id } = get_creds();

	const [items, setitems] = useState([]);
	const [isLoading, setisLoading] = useState(false);

	const onDragEnd = ({ destination, source }) => {
		if (!destination) return;

		const newItems = reorder(items, source.index, destination.index);

		setitems(newItems);
	};

	const handleChange = (index, e) => {
		setitems((pre) => {
			pre[index].value = e.target.checked;
			return [...pre];
		});
	};

	const save = async () => {
		try {
			setisLoading(true);
			await insert_details({ prefs: items }, id);
		} catch (error) {
		} finally {
			setisLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				setisLoading(true);
				const user_data = await fetch_details_by_user_id(id);

				if (user_data) {
					if (user_data.prefs) {
						setitems(user_data.prefs);
					} else {
						setitems([
							{
								id: "1",
								value: false,
								key: "openess",
								lable: "Openness to Experience",
								ques: "Do you like trying new things and exploring different ideas?",
							},
							{
								id: "2",
								value: false,
								lable: "Conscientiousness",
								key: "consc",
								ques: "Are you someone who pays attention to details and likes to be organized?",
							},
							{
								id: "3",
								value: false,
								lable: "Extraversion",
								key: "extraverion",
								ques: "Do you enjoy spending time with friends and being around people?",
							},
							{
								id: "4",
								value: false,
								lable: "Agreeableness",
								key: "agreeableness",
								ques: "Do you find it important to get along well with others and avoid conflicts?",
							},

							{
								id: "5",
								value: false,
								lable: "Neuroticism (Emotional Stability)",
								key: "neuroticism",
								ques: "Do you often feel worried or stressed about things?",
							},
						]);
					}
				} else {
					alert("Please edit your details to make preferences!");
				}
			} catch (error) {
				alert("Something went wrong!s");
			} finally {
				setisLoading();
			}
		})();
	}, [id]);

	return (
		<div>
			<Loader open={isLoading} />
			<Typography variant="h5">Set Your Preference Priority!</Typography>
			<Typography variant="body2">
				Note: Drag and drop to set your order
			</Typography>
			<Paper sx={{ marginTop: "2rem" }}>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="list">
						{(provided) => (
							<Stack
								gap={"2rem"}
								ref={provided.innerRef}
								{...provided.droppableProps}>
								{items.map((item, index) => (
									<Draggable draggableId={item.id} index={index}>
										{(provided, snapshot) => (
											<ListItem
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}>
												<Stack
													direction={"row"}
													alignItems={"center"}
													gap={"2rem"}>
													<ListItemText primary={index + 1} />
													<Stack direction={"row"} alignItems={"center"}>
														<Stack>
															<ListItemText
																sx={{ margin: 0 }}
																primary={item.lable}
																secondary={item.ques}
															/>
															<Stack direction={"row"}>
																<FormControlLabel
																	onChange={handleChange.bind(this, index)}
																	control={
																		<Checkbox checked={item.value === true} />
																	}
																	label="Yes"
																/>
																<FormControlLabel
																	control={
																		<Checkbox checked={item.value === false} />
																	}
																	label="No"
																/>
															</Stack>
														</Stack>
													</Stack>
												</Stack>
											</ListItem>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Stack>
						)}
					</Droppable>
				</DragDropContext>
			</Paper>
			{items.length && (
				<Button sx={{ marginTop: "1rem" }} onClick={save} variant="contained">
					Save
				</Button>
			)}
		</div>
	);
};

export default Prefs;

const DraggableList = React.memo(({ items, onDragEnd }) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="list">
				{(provided) => (
					<Stack
						gap={"2rem"}
						ref={provided.innerRef}
						{...provided.droppableProps}>
						{items.map((item, index) => (
							<DraggableListItem item={item} index={index} key={item.id} />
						))}
						{provided.placeholder}
					</Stack>
				)}
			</Droppable>
		</DragDropContext>
	);
});

const DraggableListItem = ({ item, index }) => {
	return (
		<Draggable draggableId={item.id} index={index}>
			{(provided, snapshot) => (
				<ListItem
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}>
					<Stack direction={"row"} alignItems={"center"} gap={"2rem"}>
						<ListItemText primary={index + 1} />
						<Stack direction={"row"} alignItems={"center"}>
							<Stack>
								<ListItemText
									sx={{ margin: 0 }}
									primary={item.lable}
									secondary={item.ques}
								/>
								<Stack direction={"row"}>
									<FormControlLabel
										control={<Checkbox checked={item.value === true} />}
										label="Yes"
									/>
									<FormControlLabel
										control={<Checkbox checked={item.value === false} />}
										label="No"
									/>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</ListItem>
			)}
		</Draggable>
	);
};

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const default_prefs = [
	{
		id: "1",
		value: "Under Grad",
		lable: "Education Level",
	},
	{
		id: "2",
		value: "Economics",
		lable: "Education Specialisation",
	},
	{
		id: "3",
		value: "New York City",
		lable: "City",
	},
	{
		id: "4",
		value: "New York",
		lable: "State",
	},
	{
		id: "5",
		value: "USA",
		lable: "Country",
	},
	{
		id: "6",
		value: "Female",
		lable: "Gender",
	},
];
