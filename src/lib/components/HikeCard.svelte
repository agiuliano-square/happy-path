<script>
	export let image;
	export let parkName;
	export let trailName;
	export let price;
	export let difficulty;
</script>

<div class="trail-card">
	<div class="img-wrapper">
		<img src={image} alt="alt text" />
	</div>
	<div class="title-row">
		<span class={`difficulty ${difficulty}`}>{difficulty}</span>
		<p class="park-name">{parkName}</p>
	</div>

	<p class="trail-name">{trailName}</p>
	<p class="price">${(price / 100).toFixed(2)}/person</p>
</div>

<style>
	.trail-card {
		width: 350px;
		display: flex;
		flex-direction: column;
		padding: 1.25rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	img {
		width: 100%;
		height: 205px;
		object-fit: cover;
		border-radius: 0.375rem;
	}

	.title-row {
		display: flex;
		align-items: baseline;
		margin-top: 0.5rem;
	}

	.difficulty {
		display: inline-block;
		white-space: nowrap;
		vertical-align: middle;
		font-size: 0.875rem;
		text-transform: uppercase;
		border-radius: 0.125rem;
		padding: 0 0.25rem;
		font-weight: 700;
	}

	.Strenuous {
		color: #822727;
		background-color: #fed7d7;
	}

	.Moderate {
		color: #2a4365;
		background-color: #bee3f8;
	}

	.trail-name {
		font-size: 1.25rem;
		font-weight: 500;
		margin-top: 0.5rem;
	}

	.park-name {
		margin-left: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: #2d3748;
		text-transform: uppercase;
	}

	.price {
		margin-top: 0.5rem;
	}
</style>
