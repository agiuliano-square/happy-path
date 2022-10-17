import { bookingsApi } from '../../../util/square-client';
import { v4 as uuidv4 } from 'uuid';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { selectedAvailability, customerId } = await request.json();

	try {
		const response = await bookingsApi.createBooking({
			booking: {
				...selectedAvailability,
				customerId,
				idempotencyKey: uuidv4()
			}
		});
		return json(response.result);
	} catch (error) {
		console.log(error);
	}
}
