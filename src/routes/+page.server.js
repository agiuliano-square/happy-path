import { catalogApi, locationsApi } from '../util/square-client';

BigInt.prototype.toJSON = function () {
	return this.toString();
};

export async function load() {
	try {
		const catalogResponse = await catalogApi.searchCatalogObjects({
			objectTypes: ['ITEM'],
			includeRelatedObjects: true
		});

		const hikes = catalogResponse.result.objects.map((hike) => {
			const difficulty =
				hike.customAttributeValues[
					Object.keys(hike.customAttributeValues).find(
						(key) => hike.customAttributeValues[key].name === 'Difficulty'
					)
				].stringValue;
			return {
				name: hike.itemData.name,
				serviceVariationId: hike.itemData.variations[0].id,
				priceMoney: hike.itemData.variations[0].itemVariationData.priceMoney,
				image: catalogResponse.result.relatedObjects.find(
					(img) => img.id === hike.itemData.imageIds[0]
				).imageData.url,
				presentAtLocationIds: hike.presentAtLocationIds ?? [],
				difficulty
			};
		});

		const locationsResponse = await locationsApi.listLocations();

		const locations = locationsResponse.result.locations.filter((l) => l.status === 'ACTIVE');

		return {
			hikes: JSON.parse(JSON.stringify(hikes)),
			locations: JSON.parse(JSON.stringify(locations))
		};
	} catch (error) {
		console.error(error);
	}
}
