import { bookingsApi } from '../../../../util/square-client';

export async function load({ params }) {
	const { locationId, serviceVariationId } = params;
	const startAt = new Date();
	startAt.setDate(startAt.getDate());
	startAt.setHours(0, 0, 0, 0);
	const endAt = new Date();
	endAt.setMonth(endAt.getMonth() + 1);

	try {
		const response = await bookingsApi.searchAvailability({
			query: {
				filter: {
					startAtRange: {
						startAt: startAt.toISOString(),
						endAt: endAt.toISOString()
					},
					locationId,
					segmentFilters: [
						{
							serviceVariationId
						}
					]
				}
			}
		});

		return {
			availabilities: JSON.parse(JSON.stringify(response.result.availabilities))
		};
	} catch (error) {
		console.log(error);
	}
}
