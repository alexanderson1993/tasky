import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";
const firebaseConfig = {
  apiKey: "AIzaSyCfyiGWIBBJQMD_AHH-6t8JGedpOlSuLL8",
  authDomain: "tasky-294722.firebaseapp.com",
  databaseURL: "https://tasky-294722.firebaseio.com",
  projectId: "tasky-294722",
  storageBucket: "tasky-294722.appspot.com",
  messagingSenderId: "690190088239",
  appId: "1:690190088239:web:3f9a58fed6e4e3e2602eda",
};

firebase.initializeApp(firebaseConfig);

export const ui = new firebaseui.auth.AuthUI(firebase.auth());
export { firebase };
