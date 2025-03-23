type OrbitObject = {
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

interface Planet extends OrbitObject {
	moons: { moon: string }[]
}

interface Moon extends OrbitObject {
	aroundPlanet: { planet: string }
}

interface ConstantPlanet {
	moons: string[];
}

export type { OrbitObject, Planet, Moon, ConstantPlanet }
