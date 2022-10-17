<script>
	export let disabled = false;
	export let loading = false;
</script>

<button {disabled}>
	{#if loading}
		<span>Loading...</span>
	{:else}
		<slot />
	{/if}
</button>

<style>
	button {
		font-size: 1rem;
		background-color: #2f855a;
		border: none;
		color: white;
		font-weight: 700;
		padding: 0.5rem;
		border-radius: 4px;
	}
	button:hover {
		background-color: #135b37;
	}
	button:disabled {
		background-color: #5bd196;
	}
</style>
