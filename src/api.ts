import { PLANETS } from "./constants";
import { ConstantPlanet, Moon, Planet } from "./types";

const BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies";

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

async function getMoons(planets: Planet[]): Promise<Moon[]> {
	const ids = getMoonsIds(planets);
	const requests = ids.map((id: string) => fetch(`${BASE_URL}/${id}`));
	const res = await Promise.all(requests);
	const responses = res.map((response) => response.json());
	return await Promise.all(responses);
}

function getMoonsIds(planets: Planet[]): string[] {
	return planets.flatMap((planet: Planet) => {
		const constantPlanet: ConstantPlanet = PLANETS[planet.id];
		return constantPlanet.moons;
	})
}

export { getPlanets, getSun, getMoons }
