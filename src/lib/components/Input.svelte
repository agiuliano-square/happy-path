<script>
	export let label;
	export let value = '';
</script>

<label>
	{label}
	<input type="text" bind:value />
</label>

<style>
	label {
		font-size: 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}
	input {
		border: 1px solid #ced4da;
		height: 2rem;
		width: 100%;
		padding-left: 8px;
		border-radius: 4px;
	}
</style>
