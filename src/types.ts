export interface User {
    countOfWords: number;
    words: {};
}

// auth.onAuthStateChanged((user) => {
//     // if the user has just signed up/ logged in
//     if (user && user.uid !== null) {

//         // get the user's email
//         userEmail = user.email;

//         // try to get the document of that user in the firestore
//         db.collection("users").doc(userEmail).get().then((doc) => {

//             // if the document exists (the user is logging in)
//             if (doc.exists) {
//                 console.log("document exists");
//                 // get the user's words
//                 var wordsDic = doc.data().words; 
//                 // iterate through the user's words
//                 for (const [key, value] of Object.entries(wordsDic)) {
//                     allWords.push(key); // add all the words in the list allWords
//                     // add words that are said by the user less than 5 times to
//                     // filteredWords (to add them in Recommended words)
//                     if ((value as Array<string>).length < 5) {
//                         filteredWords.push(key);
//                     }
//                 }
//                 // show log in UI
//                 isLoggedIn = true;

//             // if document does not exist (the user is signing up)
//             } else {
//                 console.log("document doesn't exist");
//                 let mapOfWords = {}
//                 // const wordsRef = 
//                 db.collection("users").doc("123456789").get().then((docIn) => {
//                 // wordsRef.get().then((doc) => {
//                     const words = docIn.data().words;
//                     for (var key in words) {
//                         console.log(words[key])
//                         let word: string = words[key];
//                         mapOfWords[word] = [];
//                     }
//                     db.collection("users").doc(userEmail).set({
//                         countOfWords: 0,
//                         words: mapOfWords
//                     }).then((idc) => {

//                         db.collection("users").doc(userEmail).get().then((doc) => {
//                             let wordsDic = doc.data().words; 
//                             // iterate through the user's words
//                             for (const [key, value] of Object.entries(wordsDic)) {
//                                 allWords.push(key); // add all the words in the list allWords
//                                 // add words that are said by the user less than 5 times to
//                                 // filteredWords (to add them in Recommended words)
//                                 if ((value as Array<string>).length < 5) {
//                                     filteredWords.push(key);
//                                 }
//                             }
//                             isLoggedIn = true;
//                         });
//                     })
//                 })
//                 console.log("done creating user")
//             }
//         });
//     } else {
//         isLoggedIn = false;
//     }
// });