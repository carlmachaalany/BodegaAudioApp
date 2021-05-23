import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBcs9Kc-HQsIVmqSJ0ck_pf2-RfIC0AYLg",
    authDomain: "audio-collection-53714.firebaseapp.com",
    databaseURL: "https://audio-collection-53714-default-rtdb.firebaseio.com",
    projectId: "audio-collection-53714",
    storageBucket: "gs://audio-collection-53714.appspot.com",
    messagingSenderId: "899314489094",
    appId: "1:899314489094:web:4f6f878c38df184e78b087",
    measurementId: "G-HTEZ7BRXBR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const storage = firebase.storage();
export const auth = firebase.auth();
