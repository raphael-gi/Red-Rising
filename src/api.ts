import { Planet } from "./types";

const BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies"

async function getPlanets(): Promise<Planet[]> {
	const res = await fetch(`${BASE_URL}?filter[]=isPlanet,eq,true`);
	const response = await res.json();
	return response.bodies;
}

async function getSun(): Promise<Planet> {
	const res = await fetch(`${BASE_URL}?filter[]=id,eq,soleil`);
	const response = await res.json();
	return response.bodies[0];
}

export { getPlanets, getSun }
