import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const hikeList = writable(browser && (JSON.parse(localStorage.getItem('hikeList')) || []));
hikeList.subscribe((value) => {
	browser && localStorage.setItem('hikeList', JSON.stringify(value));
});
