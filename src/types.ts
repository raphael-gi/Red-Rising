interface Planet {
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

export type { Planet }
