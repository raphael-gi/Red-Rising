import * as THREE from "three"
import { OrbitObject } from "./types"
import gsap from "gsap"
import Global from "./state"
import { ZOOM_OFFSET } from "./constants"

function getId(id: string): HTMLElement { return document.getElementById(id)! }

const infoSection = getId("info")
const title = getId("infoTitle")
const closeButton = getId("closeButton")

const list = getId("list")
const collapseList = getId("collapseList")

closeButton.addEventListener("click", () => {
	infoSection.classList.remove("visible")
})

collapseList.addEventListener("click", () => {
	list.classList.toggle("open")
})

function handlePlanetClick(planet: OrbitObject, planetMesh: THREE.Mesh) {
	title.innerHTML = planetMesh.name
	infoSection.classList.add("visible")
	goToPlanet(planet, planetMesh)
}

function goToPlanet(planet: OrbitObject, planetMesh: THREE.Mesh) {
	const targetPos = planetMesh.position.clone();
	const offset = planet.meanRadius * ZOOM_OFFSET;
	const duration = 1.5;
	const ease: gsap.EaseString = "power2.inOut";

	const camera = Global.getCamera();
	const controls = Global.getControls();

	// Camera Position
	gsap.to(camera.position, {
		duration: duration,
		x: targetPos.x + offset,
		y: targetPos.y + offset,
		z: targetPos.z + offset,
		ease: ease,
		onUpdate: () => {
			controls.update();
		}
	});

	// Camera Rotation
	gsap.to(controls.target, {
		duration: duration,
		x: targetPos.x,
		y: targetPos.y,
		z: targetPos.z,
		ease: ease,
		onUpdate: () => {
			camera.lookAt(controls.target);
			controls.update();
		}
	});

}

export { handlePlanetClick }
