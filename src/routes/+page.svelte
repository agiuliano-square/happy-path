<script>
	import HikeCard from '$lib/components/HikeCard.svelte';
	import { hikeList } from '../stores/HikesStore';

	export let data;
	const { hikes, locations } = data;

	hikeList.set(hikes);
	let selectedLocation = locations[0];
</script>

<svelte:head><title>Happy Path</title></svelte:head>

<div class="title-bar">
	<h1>Hikes in {selectedLocation.name}</h1>

	<select bind:value={selectedLocation}>
		{#each locations as location}
			<option value={location}>{location.name}</option>
		{/each}
	</select>
</div>

<div class="trail-cards">
	{#each $hikeList.filter((h) => h.presentAtLocationIds.includes(selectedLocation.id)) as hike}
		<a href={`${selectedLocation.id}/trails/${hike.serviceVariationId}`}>
			<HikeCard
				parkName={selectedLocation.name}
				trailName={hike.name}
				image={hike.image}
				price={hike.priceMoney.amount}
				difficulty={hike.difficulty}
			/>
		</a>
	{/each}
</div>

<style>
	h1 {
		font-size: 3rem;
		padding: 2rem 0;
	}

	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	/* TODO: use Andy Bell's flexible grid here */
	.trail-cards {
		display: flex;
		gap: 1.5rem;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
