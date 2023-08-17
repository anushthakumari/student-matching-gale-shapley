import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCLU2nFcAPMVfCfW2e0MCS81Ih23n7YxNo",
	authDomain: "restaurants-e55e6.firebaseapp.com",
	databaseURL: "https://restaurantapp-c2ed6-default-rtdb.firebaseio.com",
	projectId: "restaurants-e55e6",
	storageBucket: "restaurants-e55e6.appspot.com",
	messagingSenderId: "176845749029",
	appId: "1:176845749029:web:cd0f40a7faa54a599ff8cc",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
