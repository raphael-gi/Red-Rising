import { ConstantPlanets } from "./types";

const PLANETS: ConstantPlanets = {
	mercure: {
		id: 0,
		moons: []
	},
	venus: {
		id: 1,
		moons: []
	},
	terre: {
		id: 2,
		moons: ["lune"]
	},
	mars: {
		id: 3,
		moons: ["phobos", "deimos"]
	},
	jupiter: {
		id: 4,
		moons: ["io", "ganymede", "europa", "callisto"]
	},
	saturne: {
		id: 5,
		moons: ["titan", "rhea", "japet"]
	},
	uranus: {
		id: 6,
		moons: []
	},
	neptune: {
		id: 7,
		moons: []
	}
}

const PLANET_SCALE = 50;
const ZOOM_OFFSET = 2000;

export { PLANETS, PLANET_SCALE, ZOOM_OFFSET }
