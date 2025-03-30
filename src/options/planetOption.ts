import { Mesh } from "three";
import { handlePlanetClick } from "../events";
import Planet from "../scene/planet";
import { PlanetInterface } from "../types"
import MoonOption from "./moonOption";

class PlanetOption extends HTMLDivElement {
	private planet: PlanetInterface;
	private mesh: Mesh;

	constructor(planet: Planet) {
		super()

		this.planet = planet.getOrbitObject();
		this.mesh = planet.getMesh();

		const tag = this.getTitleText();
		super.appendChild(tag);

		planet.getMoons().forEach((moon) => {
			const moonOption = new MoonOption(moon);
			super.appendChild(moonOption);
		})
	}

	private getTitleText(): HTMLHeadingElement {
		const tag = document.createElement("h3");
		tag.innerText = this.planet.englishName;
		tag.addEventListener("click", () => handlePlanetClick(this.planet, this.mesh))
		return tag;
	}
}

export default PlanetOption;
