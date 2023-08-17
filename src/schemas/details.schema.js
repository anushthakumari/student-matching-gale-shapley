import {
	getDoc,
	doc,
	setDoc,
	serverTimestamp,
	collection,
	getDocs,
} from "firebase/firestore";

import { firestore } from "../configs/firebase.config";

const details_schema = {
	name: "match_details",
	fields: {
		email: "email",
		pass: "pass",
	},
};

export default details_schema;

export const fetch_details_by_user_id = async (user_id) => {
	const docRef = doc(firestore, details_schema.name, user_id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return { ...docSnap.data(), doc_id: docSnap.id };
	} else {
		return null;
	}
};

export const insert_details = async (data, user_id) => {
	await setDoc(
		doc(firestore, details_schema.name, user_id),
		{
			...data,
			last_updated: serverTimestamp(),
		},
		{
			merge: true,
		}
	);
};

export const fetch_all_users_details = async () => {
	const usersRef = collection(firestore, details_schema.name);
	const { docs } = await getDocs(usersRef);

	return docs.map((d) => ({ ...d.data(), doc_id: d.id }));
};
