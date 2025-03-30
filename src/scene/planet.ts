import { MoonInterface, PlanetInterface } from "../types";
import OrbitObject from "./orbitobject";
import Moon from "./moon";
import Orbit from "./orbit";
import PlanetOption from "../options/planetOption";

class Planet extends OrbitObject<PlanetInterface> {
	private moons: Moon[];

	constructor(planet: PlanetInterface) {
		const orbit = new Orbit(planet);
		super(planet, orbit);
		this.moons = [];
	}

	public getMoons(): Moon[] {
		return this.moons;
	}

	public setMoons(allMoons: MoonInterface[]) {
		const planet = super.getOrbitObject();
		allMoons.forEach((moon) => {
			if (moon.aroundPlanet.planet === planet.id) {
				this.moons.push(new Moon(moon, this))
			}
		})
	}

	public addToScene(): void {
		super.addToScene();
		this.moons.forEach((moon) => moon.addToScene())
	}

	public getOption() {
		return new PlanetOption(this);
	}
}

export default Planet;
