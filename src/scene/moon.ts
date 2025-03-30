import { PLANET_SCALE } from "../constants";
import { MoonInterface } from "../types";
import Orbit from "./orbit";
import OrbitObject from "./orbitobject";
import Planet from "./planet";

class Moon extends OrbitObject<MoonInterface> {
	constructor(moon: MoonInterface, planet: Planet) {
		const orbit = new Orbit(moon, planet.getPosition().x, planet.getPosition().y, PLANET_SCALE);
		super(moon, orbit);
	}
}

export default Moon;
