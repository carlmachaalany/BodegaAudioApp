<script lang="ts">
	import Navbar from "./Components/Navbar.svelte";
	import Header from "./Components/Header.svelte";
	import Buttons from "./Components/Buttons.svelte";
	import Instructions from "./Components/Instructions.svelte";
	import { auth } from "./firebase";

	let isLoggedIn: boolean;
	let word: string;

	auth.onAuthStateChanged((user) => {
		if (user && user.uid !== null) {
			isLoggedIn = true;
		} else {
			isLoggedIn = false;
		}
	});
</script>

<main>
	<Navbar {isLoggedIn} />
	{#if isLoggedIn}
		<Header />
		<div>
			<div class="container">
				<Instructions />
				<div class="container input-field">
					<label for="word">Word to speak</label>
					<input id="word" type="text" bind:value={word} />
					<Buttons {word} />
				</div>
			</div>
		</div>
	{:else}
		<Header>
			<h6 class="center-align">
				Please login to make your contributions!
			</h6>
		</Header>
	{/if}
</main>

<style>
	input {
		display: block;
		margin: 0 auto;
	}
	div {
		background-color: rgb(241, 241, 241);
	}
</style>
