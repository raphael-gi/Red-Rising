import Planet from "../scene/planet";
import { PlanetInterface } from "../types"
import MoonOption from "./moonOption";
import Option from "./option";

class PlanetOption extends Option<PlanetInterface, Planet, "h3"> {
	constructor(planet: Planet) {
		super(planet, "h3");

		planet.getMoons().forEach((moon) => {
			const moonOption = new MoonOption(moon);
			super.appendChild(moonOption);
		})
	}
}

export default PlanetOption;
