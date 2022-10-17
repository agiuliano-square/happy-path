import { json } from '@sveltejs/kit';
import { customersApi } from '../../../util/square-client';

export async function GET({ url }) {
	const email = url.searchParams.get('email');
	try {
		const response = await customersApi.searchCustomers({
			query: {
				filter: {
					emailAddress: {
						exact: email
					}
				}
			}
		});

		return json(response.result);
	} catch (error) {
		console.log(error);
	}
}

export async function POST({ request }) {
	try {
		const { firstName, lastName, email } = await request.json();
		const response = await customersApi.createCustomer({
			givenName: firstName,
			familyName: lastName,
			emailAddress: email
		});

		return json(response.result);
	} catch (error) {
		console.log(error);
	}
}
