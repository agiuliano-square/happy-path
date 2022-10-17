<script>
	import { onMount } from 'svelte';
	import { hikeList } from '../../../../stores/HikesStore';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	export let data;

	let selectedAvailability;
	let firstName;
	let lastName;
	let email;
	let card;

	let error = '';
	let loading = false;
	let isModalOpen = false;
	let selectedDate = new Date().toISOString().split('T')[0];

	const selectedHike = $hikeList.find(
		(hike) => hike.serviceVariationId === $page.params.serviceVariationId
	);

	const appId = 'sandbox-sq0idb-H1cgz2Yv_r8bCaIKNp5IUg';
	const locationId = $page.params.locationId;

	async function processPayment() {
		const token = await tokenize(card);
		let body = JSON.stringify({
			locationId,
			sourceId: token,
			price: selectedHike.priceMoney.amount
		});
		return fetch('/api/payment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});
	}

	async function searchCustomers() {
		return fetch(`/api/customers?email=${email}`);
	}

	function createCustomer() {
		const body = JSON.stringify({
			firstName,
			lastName,
			email
		});
		return fetch('/api/customers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});
	}

	function createBooking(customerId) {
		const body = JSON.stringify({
			selectedAvailability,
			customerId
		});
		return fetch('/api/booking', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});
	}

	async function handleSubmit(event) {
		loading = true;
		try {
			let customer;
			let data;
			/* PROCESS PAYMENT */
			const paymentResponse = await processPayment();
			if (!paymentResponse.ok) {
				throw new Error('There was an error processing the payment');
			}

			/* CHECK IF CUSTOMER EXISTS */
			const searchCustomersResponse = await searchCustomers();
			if (!searchCustomersResponse.ok) {
				throw new Error('There was an error finding the customer profile');
			}
			data = await searchCustomersResponse.json();
			customer = data?.customers?.[0];

			/* CREATE NEW CUSTOMER IF ONE DOESN'T ALREADY EXIST */
			if (!customer) {
				const createCustomerResponse = await createCustomer();
				if (!createCustomerResponse.ok) {
					throw new Error('There was an error creating the customer profile');
				}
				data = await createCustomerResponse.json();
				customer = data.customer;
			}

			/* CREATE BOOKING */
			const bookingResponse = await createBooking(customer.id);
			if (!bookingResponse.ok) {
				throw new Error('There was an error creating the booking');
			}
			isModalOpen = true;
			event.target.reset();
			card.clear();
			loading = false;
		} catch (err) {
			loading = false;
			return (error = err.message);
		}
	}

	async function initializeCard(payments) {
		const card = await payments.card();
		await card.attach('#card-container');
		return card;
	}

	async function tokenize(paymentMethod) {
		const tokenResult = await paymentMethod.tokenize();
		if (tokenResult.status === 'OK') {
			return tokenResult.token;
		} else {
			let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
			if (tokenResult.errors) {
				errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
			}

			throw new Error(errorMessage);
		}
	}

	onMount(() => {
		(async function () {
			if (!Square) {
				throw new Error('Square.js failed to load properly');
			}
			const payments = Square.payments(appId, locationId);
			try {
				card = await initializeCard(payments);
			} catch (e) {
				console.error('Initializing Card failed', e);
				return;
			}
		})();
	});
</script>

<svelte:head><title>{selectedHike.name} - Happy Path</title></svelte:head>

{#if isModalOpen}
	<div class="modal-container">
		<div class="modal">
			<h2>Success!</h2>
			<p>You have successfully booked a guided hike of {selectedHike.name}</p>
			<a href="/">Return to Homepage</a>
		</div>
	</div>
{/if}

<h1>{selectedHike.name}</h1>

<img src={selectedHike.image} alt="" />

<form on:submit|preventDefault={handleSubmit}>
	<div class="input-group">
		<label>
			Date
			<input type="date" bind:value={selectedDate} />
		</label>

		<div class="times-container">
			<p>Availabilities</p>
			<div class="times-labels">
				{#each data.availabilities.filter( (a) => a.startAt.startsWith(selectedDate.toString()) ) as availability}
					<label class="form-control">
						<input type="radio" bind:group={selectedAvailability} value={availability} />
						{new Date(availability.startAt).toLocaleTimeString('en-us', {
							hour: 'numeric',
							minute: 'numeric'
						})}
					</label>
				{/each}
			</div>
		</div>
	</div>
	<div class="input-group">
		<div class="name-group">
			<Input label="First Name" bind:value={firstName} />
			<Input label="Last Name" bind:value={lastName} />
		</div>
		<Input label="Email" bind:value={email} />
		<div id="card-container" />
	</div>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	<Button {loading} disabled={loading}>Book Tour</Button>
</form>

<style>
	img {
		object-fit: cover;
		height: 33vh;
		width: 100%;
		border-radius: 0.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		padding-bottom: 4rem;
	}
	label {
		display: flex;
		flex-direction: column;
	}
	.times-container {
		display: flex;
		flex-direction: column;
	}
	.times-labels {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}

	label:has(input[type='radio']) {
		width: max-content;
		padding: 0.75rem;
		background-color: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
	}
	label:has(input[type='radio']:checked) {
		background: #2f855a;
		color: white;
		border-color: #2f855a;
	}
	input[type='radio'] {
		border: 0px;
		clip: rect(0px, 0px, 0px, 0px);
		height: 1px;
		width: 1px;
		margin: -1px;
		padding: 0px;
		overflow: hidden;
		white-space: nowrap;
		position: absolute;
	}
	label:has(input[type='radio']:focus) {
		outline: 2px solid rgba(66, 153, 225, 0.8);
		outline-offset: 2px;
	}
	.error {
		color: tomato;
	}

	.name-group {
		display: flex;
		gap: 12px;
	}

	.input-group {
		background-color: rgb(249 250 251);
		padding: 1rem;
		margin: 1rem 0;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* MODAL */
	.modal-container {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 10;
	}

	.modal {
		padding: 2rem;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		border: 1px solid #ced4da;
	}
</style>
