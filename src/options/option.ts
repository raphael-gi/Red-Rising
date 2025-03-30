import { Mesh } from "three";
import { handlePlanetClick } from "../events";
import { OrbitObjectType } from "../types";
import OrbitObject from "../scene/orbitobject";

class Option<T extends OrbitObjectType, O extends OrbitObject<T>, K extends keyof HTMLElementTagNameMap> extends HTMLDivElement {
	private orbitObject: T;
	private mesh: Mesh;

	constructor(orbitObject: O, elementTag: K) {
		super();
		this.orbitObject = orbitObject.getOrbitObject();
		this.mesh = orbitObject.getMesh();

		const tag = this.getTitleText(elementTag);
		super.appendChild(tag);
	}

	protected getTitleText<K extends keyof HTMLElementTagNameMap>(elementTag: K): HTMLHeadingElement {
		const tag = document.createElement(elementTag);
		tag.innerText = this.orbitObject.englishName;
		tag.addEventListener("click", () => handlePlanetClick(this.orbitObject, this.mesh));
		return tag as HTMLHeadingElement;
	}
}

export default Option;
