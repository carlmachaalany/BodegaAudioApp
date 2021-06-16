<script lang="ts">
	import Navbar from "./Components/Navbar.svelte";
	import Header from "./Components/Header.svelte";
	import Buttons from "./Components/Buttons.svelte";
	import Instructions from "./Components/Instructions.svelte";
	import { auth, db } from "./firebase"
	import AdminModal from './Components/AdminModal.svelte';

	let isLoggedIn: boolean;
	let word: string;
	let userEmail: string;
	let allWords = [];
	let filteredWords = [];

	function getWords(doc: any) {
		let all = [];
		let filtered = [];
		// get the user's words
		let wordsDic = doc.data().words; 
		// iterate through the user's words
		for (const [key, value] of Object.entries(wordsDic)) {
			all.push(key); // add all the words in the list allWords
			// add words that are said by the user less than 5 times to
			// filteredWords (to add them in Recommended words)
			if ((value as Array<string>).length < 5) {
				filtered.push(key);
			}
		}
		return [all, filtered];
	}

	auth.onAuthStateChanged((user) => {
		// if the user has just signed up/ logged in
		if (user && user.uid !== null) {
			console.log("logged in")
			// get the user's email
			userEmail = user.email;

			// try to get the document of that user in the firestore
			db.collection("users").doc(userEmail).get().then((doc) => {

				// if the document exists (the user is logging in)
				if (doc.exists) {
					[allWords, filteredWords] =  getWords(doc);
					// show log in UI
					isLoggedIn = true;

				// if document does not exist (the user is signing up)
				} else {
					console.log("document doesn't exist");
					let mapOfWords = {}
					db.collection("users").doc("123456789").get().then(async (docIn) => {
						const words = docIn.data().words;
						for (var key in words) {
							let word: string = words[key];
							mapOfWords[word] = [];
						}
						await db.collection("users").doc(userEmail).set({
							countOfWords: 0,
							words: mapOfWords
						})
						db.collection("users").doc(userEmail).get().then((doc) => {
							[allWords, filteredWords] =  getWords(doc);
							isLoggedIn = true;
						});
					})
				}

				// show the admin button if the user is an admin
				user.getIdTokenResult().then(idTokenResult => {
					if (idTokenResult.claims.admin) {
						const adminBody = document.getElementById("admin-btn");
						adminBody.style.display = "block";
					}
				})
			});
		} else {
			console.log("logged out");
			isLoggedIn = false;
		}
	});

	let modalOpen: boolean = false;
	const toggleAdminModal = () => {
		modalOpen = !modalOpen;
	}
</script>

<main>
	<Navbar {isLoggedIn} />
	{#if isLoggedIn}
		<!-- <div class="containers"> -->
		<Header />
		<div class="body">
			<div class="container">
				<Instructions />
				<div class="container">
					<label for="word">Word to speak</label>
					<input id="word" type="text" bind:value={word} />
					<Buttons {word} {userEmail} {allWords}/>
				</div>
			</div>
		</div>
		<div class="recom-words-body">
			<h5>Recommended Words</h5>
			<div class="recom-words">
				{#each filteredWords as w}
					<div class="chip waves-effect" on:click={() => {word = w}}>
						{w}
					</div>
				{/each}
			</div>
		</div>
		<div id="admin-btn" style="display: none;">
			<button on:click={toggleAdminModal} style="text-decoration: none;" class="admin modal-trigger white-text hover:white-text waves-effect waves-light btn-large teal accent-4">Admin UI</button>		
		</div>

		{#if modalOpen}
			<AdminModal bind:modalOpen />
			<!-- <div on:click={toggleAdminModal} id="adminmodal" class="modal modal-fixed-footer">
				<div class="modal-content">
					<h4>Modal Header</h4>
					<p>A bunch of text</p>
				</div>
				<div class="modal-footer">
					<a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
				</div>
			</div> -->
		{/if}
		<!-- If the user is an admin, add a button that goes to the admin UI. 
		The admin should be able to:
		1) View the word list
		2) Add a word to the word list
		3) Remove a word from the word list
		4) View the list of users (with countOfWords?) -->
		<!-- </div> -->
	{:else}
		<Header>
			<h6 class="center-align">
				Please login to make your contributions!
			</h6>
		</Header>
	{/if}
	<!-- <form on:submit={addAdmin}>
		<input type="email" placeholder="User email" id="admin-email" bind:value={adminEmail}/>
		<button>Make Admin</button>
	</form> -->
</main>

<style>
	main {
		padding-bottom: 10px;
		position: relative;
		height: 100%;
		overflow-y: scroll;
	}
	input {
		display: block;
		margin: 0 auto;
	}
	.body {
		background-color: rgb(241, 241, 241);
	}
	.recom-words-body {
		margin: 20px 10px 10px 10px;
		border-radius: 5px;
		border: 1px solid rgb(168,168,168, 0.3);
	}
	.recom-words-body h5 {
		margin-top: 10px;
		text-align: center;
	}
	.recom-words {
		padding: 0 10px 10px 10px;
		max-height: 120px;
		overflow: scroll;
	}
	#word {
		margin-bottom:0;
	}
	#admin-btn {
		position: relative;
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}
</style>
