import {
	collection,
	getDoc,
	doc,
	getDocs,
	query,
	where,
	addDoc,
	setDoc,
	deleteDoc,
	and,
	serverTimestamp,
} from "firebase/firestore";

import { firestore } from "../configs/firebase.config";
import { fetch_details_by_user_id } from "./details.schema";

const request_schema = {
	name: "match_requests",
	fields: {
		from_user_id: "from_user_id",
		to_user_id: "to_user_id",
	},
};

export default request_schema;

export const fetch_user_request = async (user_id) => {
	const collRef = collection(firestore, request_schema.name);
	const q = query(
		collRef,
		where(request_schema.fields.to_user_id, "==", user_id)
	);
	const { size, docs } = await getDocs(q);

	if (size > 0) {
		const dt = [];

		for (const doc of docs) {
			const d = doc.data();
			const user_data = await fetch_details_by_user_id(d.from_user_id);

			dt.push({ ...d, user_data, doc_id: doc.id });
		}

		return dt;
	}

	return [];
};
export const fetch_user_make_request = async (user_id) => {
	const collRef = collection(firestore, request_schema.name);
	const q = query(
		collRef,
		where(request_schema.fields.from_user_id, "==", user_id)
	);
	const { size, docs } = await getDocs(q);

	if (size > 0) {
		const dt = [];

		for (const doc of docs) {
			const d = doc.data();
			const user_data = await fetch_details_by_user_id(d.to_user_id);

			dt.push({ ...d, user_data, doc_id: doc.id });
		}

		return dt;
	}

	return [];
};

export const make_request = async (
	from_user_id = "",
	to_user_id = "",
	status = "pending"
) => {
	const collRef = collection(firestore, request_schema.name);

	await addDoc(collRef, {
		from_user_id,
		to_user_id,
		status,
		created_at: serverTimestamp(),
	});
};

export const already_requested = async (from_user_id = "", to_user_id = "") => {
	const collRef = collection(firestore, request_schema.name);
	const q = query(
		collRef,
		and(
			where(request_schema.fields.from_user_id, "==", from_user_id),
			where(request_schema.fields.to_user_id, "==", to_user_id)
		)
	);
	const { size, docs } = await getDocs(q);

	if (size > 0) {
		return { ...docs[0].data(), doc_id: docs[0].id };
	}

	const q1 = query(
		collRef,
		and(
			where(request_schema.fields.from_user_id, "==", to_user_id),
			where(request_schema.fields.to_user_id, "==", from_user_id)
		)
	);

	const { size: req_size, docs: req_docs } = await getDocs(q1);

	console.log({ req_size, size });

	if (req_size > 0) {
		return { ...req_docs[0].data(), doc_id: req_docs[0].id };
	}

	return false;
};

export const delete_request = async (doc_id) => {
	const docRef = doc(firestore, request_schema.name, doc_id);
	await deleteDoc(docRef);
};
