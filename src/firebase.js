import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';

// databaseURL: "https://audio-collection-53714-default-rtdb.firebaseio.com",
const firebaseConfig = {
  apiKey: "AIzaSyBfTes7onZs-ZTgiwJltliiHDFMXtO-_T8",
  authDomain: "bodegaappaudio.firebaseapp.com",
  projectId: "bodegaappaudio",
  storageBucket: "bodegaappaudio.appspot.com",
  messagingSenderId: "983686206872",
  appId: "1:983686206872:web:b23473ee087d8bba4e87ed"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const storage = firebase.storage();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const functions = firebase.functions();
export const dbNotCalled = firebase.firestore;
