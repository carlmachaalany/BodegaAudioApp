<script lang="ts">
	import Header from "./Components/Header.svelte";
	import Buttons from "./Components/Buttons.svelte";
	import Instructions from "./Components/Instructions.svelte";

	let word: string;
</script>

<main>
	<Header />
	<div>
		<Instructions />
		<input
			type="text"
			bind:value={word}
			placeholder="input word to speak"
		/>
		<Buttons {word} />
	</div>
</main>

<style>
	input {
		display: block;
		margin: 0 auto;
	}
	div {
		background-color: rgb(230, 230, 230);
	}
</style>
