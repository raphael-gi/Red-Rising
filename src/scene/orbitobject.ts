import { Mesh, MeshBasicMaterial, SphereGeometry, Vector2 } from "three";
import Orbit from "./orbit"
import { handlePlanetClick } from "../events";
import { PLANET_SCALE } from "../constants";
import { OrbitObjectType } from "../types";
import Global from "../state";

abstract class OrbitObject<T extends OrbitObjectType> {
	private orbit: Orbit;
	private orbitObject: T;
	private mesh: Mesh;

	constructor(orbitObject: T, orbit: Orbit) {
		this.orbit = orbit;
		this.orbitObject = orbitObject;
		this.mesh = this.buildMesh();
	}

	public getOrbitObject(): T {
		return this.orbitObject;
	}

	public getMesh(): Mesh {
		return this.mesh;
	}

	public getPosition(): Vector2 {
		return this.orbit.getCurve().getPoint(this.orbitObject.mainAnomaly);
	}

	public addToScene(): void {
		const scene = Global.getScene();
		const interactionManager = Global.getInteractionManager();
		scene.add(this.orbit);

		interactionManager.add(this.mesh);
		scene.add(this.mesh);
	}

	private buildMesh(): Mesh {
		const planetGeometry = new SphereGeometry(1, 32, 32)
		const planetMaterial = new MeshBasicMaterial({ color: 0xffffff })
		const orbitObjectMesh = new Mesh(planetGeometry, planetMaterial)

		orbitObjectMesh.name = this.orbitObject.englishName

		orbitObjectMesh.addEventListener("click" as any, ({ target }) => handlePlanetClick(this.orbitObject, target))

		const equaRadius = (this.orbitObject.equaRadius > 0 ? this.orbitObject.equaRadius : this.orbitObject.meanRadius) * 2 * PLANET_SCALE
		const polarRadius = (this.orbitObject.polarRadius > 0 ? this.orbitObject.polarRadius : this.orbitObject.meanRadius) * 2 * PLANET_SCALE

		orbitObjectMesh.scale.set(equaRadius, equaRadius, polarRadius)

		const position = this.getPosition()
		orbitObjectMesh.position.set(position.x, position.y, 0)

		return orbitObjectMesh;
	}
}

export default OrbitObject;
