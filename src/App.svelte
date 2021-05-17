<script lang="ts">
	import Navbar from "./Components/Navbar.svelte";
	import Header from "./Components/Header.svelte";
	import Buttons from "./Components/Buttons.svelte";
	import Instructions from "./Components/Instructions.svelte";

	let word: string;
</script>

<main>
	<Navbar />
	<Header />
	<div>
		<Instructions />
		<div class="container input-field">
			<label for="word">Word to speak</label>
			<input id="word" type="text" bind:value={word} />
			<Buttons {word} />
		</div>
	</div>
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
