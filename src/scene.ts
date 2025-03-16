import * as THREE from "three"
import { getPlanets, getSun } from "./api"
import { Planet } from "./types";
import { InteractionManager } from "three.interactive";
import { handlePlanetClick } from "./events";
import { OrbitControls } from "three/examples/jsm/Addons.js";

async function buildScene(scene: THREE.Scene, camera: THREE.PerspectiveCamera, orbitControls: OrbitControls, interactionManager: InteractionManager) {
	const planets: Planet[] = await getPlanets()
	const sun: Planet = await getSun()

	const sunMesh = buildSun(sun)

	sunMesh.addEventListener("click" as any, ({ target }) => {
		handlePlanetClick(target)
	})

	interactionManager.add(sunMesh)
	scene.add(sunMesh)

	planets.forEach((planet) => {
		const { orbitMesh, planetMesh } = buildPlanet(planet)
		scene.add(orbitMesh)
		interactionManager.add(planetMesh)
		scene.add(planetMesh)
		addPlanetOption(planet, planetMesh, camera, orbitControls)
	})
}

function buildSun(sun: Planet): THREE.Mesh {
	const sunGeometry = new THREE.SphereGeometry(1, 32, 32)

	const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)

	sunMesh.name = sun.englishName

	const sunScale = 5

	sunMesh.scale.set(
		sun.equaRadius * 2 * sunScale,
		sun.equaRadius * 2 * sunScale,
		sun.meanRadius * 2 * sunScale
	)

	return sunMesh
}

function buildPlanet(planet: Planet): {orbitMesh: THREE.Line, planetMesh: THREE.Mesh} {
	const majorAxis = planet.semimajorAxis * 2
	const orbitCurve = new THREE.EllipseCurve(
		0,
		0,
		majorAxis,
		majorAxis * (1 - planet.eccentricity),
		0,
		2 * Math.PI,
		false,
		planet.longAscNode
	)

	const orbitPoints = orbitCurve.getPoints(360)

	const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
	// orbitGeometry.rotateY(planet.inclination / 360)

	const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

	const orbitMesh = new THREE.Line(orbitGeometry, orbitMaterial)

	const planetGeometry = new THREE.SphereGeometry(1, 32, 32)
	const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	planetMesh.name = planet.englishName

	planetMesh.addEventListener("click" as any, ({ target }) => {
		handlePlanetClick(target)
	})

	const planetScale = 500

	planetMesh.scale.set(
		planet.equaRadius * 2 * planetScale,
		planet.equaRadius * 2 * planetScale,
		planet.polarRadius * 2 * planetScale
	)

	const planetPosition = orbitCurve.getPoint(planet.mainAnomaly)
	planetMesh.position.set(planetPosition.x, planetPosition.y, 0.5)

	return { orbitMesh, planetMesh }
}

function addPlanetOption(planet: Planet, planetMesh: THREE.Mesh, camera: THREE.PerspectiveCamera, orbitControls: OrbitControls) {
	const objects = document.getElementById("objects")!
	const optionDiv = document.createElement("div")
	optionDiv.innerText = planet.englishName
	optionDiv.addEventListener("click", (event) => {
		// camera.quaternion.slerp(planetMesh.position, 0)
		orbitControls.target = planetMesh.position
		// camera.lookAt(planetMesh.position)
		console.log(event)
	})

	objects.appendChild(optionDiv)
}

export { buildScene }
