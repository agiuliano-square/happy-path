import { json } from '@sveltejs/kit';
import { paymentsApi } from '../../../util/square-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
	const { locationId, sourceId, price } = await request.json();
	try {
		const response = await paymentsApi.createPayment({
			locationId,
			sourceId,
			idempotencyKey: uuidv4(),
			amountMoney: {
				amount: price,
				currency: 'USD'
			}
		});
		console.log(response.result);

		return json(response.result);
	} catch (error) {
		console.log(error);
	}
}
