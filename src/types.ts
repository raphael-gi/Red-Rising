type OrbitObjectType = {
	id: string;
	englishName: string;
	semimajorAxis: number;
	perihelion: number;
	aphelion: number;
	eccentricity: number;
	inclination: number;
	meanRadius: number;
	equaRadius: number;
	polarRadius: number;
	axialTilt: number;
	sideralOrbit: number;
	sideralRotation: number;
	mainAnomaly: number;
	longAscNode: number;
}

interface PlanetInterface extends OrbitObjectType {
	moons: { moon: string }[]
}

interface MoonInterface extends OrbitObjectType {
	aroundPlanet: { planet: string }
}

interface ConstantPlanets {
	[key: string]: {
		id: number;
		moons: string[]
	}
}

interface ConstantPlanet {
	moons: string[];
}

export type { OrbitObjectType, PlanetInterface, MoonInterface, ConstantPlanet, ConstantPlanets }
