import { Mesh } from "three";
import { MoonInterface } from "../types"
import Moon from "../scene/moon";
import { handlePlanetClick } from "../events";

class MoonOption extends HTMLDivElement {
	private moon: MoonInterface;
	private mesh: Mesh;

	constructor(moon: Moon) {
		super()
		super.classList.add("moons")
		this.moon = moon.getOrbitObject();
		this.mesh = moon.getMesh();

		const tag = this.getTitleText();
		super.appendChild(tag)
	}

	private getTitleText(): HTMLHeadingElement {
		const tag = document.createElement("h5");
		tag.innerText = this.moon.englishName;
		tag.addEventListener("click", () => handlePlanetClick(this.moon, this.mesh))
		return tag;
	}
}

export default MoonOption;
