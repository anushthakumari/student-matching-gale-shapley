import {
	collection,
	getDoc,
	doc,
	getDocs,
	query,
	where,
	addDoc,
	setDoc,
	serverTimestamp,
} from "firebase/firestore";

import { firestore } from "../configs/firebase.config";

const prefs_schema = {
	name: "match_prefs",
	fields: {},
};

export default prefs_schema;

export const insert_prefs = async (data = [], id = "") => {
	await setDoc(
		doc(firestore, prefs_schema.name, id),
		{
			prefs: data,
			last_updated: serverTimestamp(),
		},
		{
			merge: true,
		}
	);
};

export const fetch_prefs_by_id = async (id = "") => {
	const docRef = doc(firestore, prefs_schema.name, id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};
