import { Client, Environment } from 'square';

const client = new Client({
	accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN, // this can be found in the Square Developer Dashboard
	environment: Environment.Sandbox
});

//export all of the APIs that we want to use in the app
export const { bookingsApi, catalogApi, customersApi, locationsApi, paymentsApi } = client;
