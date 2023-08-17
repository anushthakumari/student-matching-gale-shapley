import {
	collection,
	getDoc,
	doc,
	getDocs,
	query,
	where,
	addDoc,
	setDoc,
	and,
	or,
	serverTimestamp,
} from "firebase/firestore";

import { firestore } from "../configs/firebase.config";
import { fetch_details_by_user_id } from "./details.schema";

const partners_schema = {
	name: "match_partners",
	fields: {
		from_user_id: "from_user_id",
		to_user_id: "to_user_id",
	},
};

export default partners_schema;

export const fetch_partners = async (user_id = "") => {
	const collRef = collection(firestore, partners_schema.name);
	const q = query(
		collRef,
		or(
			where(partners_schema.fields.from_user_id, "==", user_id),
			where(partners_schema.fields.to_user_id, "==", user_id)
		)
	);
	const { size, docs } = await getDocs(q);

	if (size > 0) {
		const dt = [];

		for (const doc of docs) {
			const d = doc.data();

			let user_data;
			if (d.from_user_id === user_id) {
				user_data = await fetch_details_by_user_id(d.to_user_id);
			} else {
				user_data = await fetch_details_by_user_id(d.from_user_id);
			}

			dt.push({ ...d, user_data, doc_id: doc.id });
		}

		return dt;
	}

	return [];
};

export const insert_partners = async (data = {}) => {
	const collRef = collection(firestore, partners_schema.name);

	await addDoc(collRef, {
		...data,
		created_at: serverTimestamp(),
	});
};

export const is_already_partner = async (
	from_user_id = "",
	to_user_id = ""
) => {
	const collRef = collection(firestore, partners_schema.name);
	const q = query(
		collRef,
		and(
			where(partners_schema.fields.from_user_id, "==", from_user_id),
			where(partners_schema.fields.to_user_id, "==", to_user_id)
		)
	);
	const { size, docs } = await getDocs(q);

	if (size > 0) {
		return { ...docs[0].data(), doc_id: docs[0].id };
	}

	const q1 = query(
		collRef,
		and(
			where(partners_schema.fields.from_user_id, "==", to_user_id),
			where(partners_schema.fields.to_user_id, "==", from_user_id)
		)
	);

	const { size: req_size, docs: req_docs } = await getDocs(q1);

	console.log({ req_size, size });

	if (req_size > 0) {
		return { ...req_docs[0].data(), doc_id: req_docs[0].id };
	}

	return false;
};
