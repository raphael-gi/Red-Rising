import * as THREE from "three"
import { getMoons, getPlanets, getSun } from "./api"
import { Moon, OrbitObject, Planet } from "./types";
import { handlePlanetClick } from "./events";
import Global from "./state";
import { PLANET_SCALE } from "./constants";

async function buildScene() {
	const planets: Planet[] = await getPlanets()
	const moons: Moon[] = await getMoons(planets);
	const sun: Planet = await getSun()

	const sunMesh = buildSun(sun)

	const interactionManager = Global.getInteractionManager()
	interactionManager.add(sunMesh)

	const scene = Global.getScene()
	scene.add(sunMesh)

	planets.forEach((planet) => {
		const planetMoons: Moon[] = []
		moons.forEach((moon) => {
			if (moon.aroundPlanet.planet === planet.id) {
				planetMoons.push(moon)
			}
		})
		const { orbitMesh, planetMesh } = buildPlanet(planet, planetMoons)
		scene.add(orbitMesh)
		interactionManager.add(planetMesh)
		scene.add(planetMesh)
		addPlanetOption(planet, planetMesh)
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

function buildPlanet(planet: Planet, moons: Moon[]): { orbitMesh: THREE.Line, planetMesh: THREE.Mesh } {
	const { orbitCurve, orbitMesh } = createOrbit(planet)

	const planetGeometry = new THREE.SphereGeometry(1, 32, 32)
	const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	planetMesh.name = planet.englishName

	planetMesh.addEventListener("click" as any, ({ target }) => handlePlanetClick(planet, target))

	planetMesh.scale.set(
		planet.equaRadius * 2 * PLANET_SCALE,
		planet.equaRadius * 2 * PLANET_SCALE,
		planet.polarRadius * 2 * PLANET_SCALE
	)

	const planetPosition = orbitCurve.getPoint(planet.mainAnomaly)
	planetMesh.position.set(planetPosition.x, planetPosition.y, 0)

	moons.forEach((moon) => buildMoon(planetPosition, moon))

	return { orbitMesh, planetMesh }
}

function buildMoon(planetPosition: THREE.Vector2, moon: Moon) {
	const { orbitCurve, orbitMesh } = createOrbit(moon, planetPosition.x, planetPosition.y, PLANET_SCALE / 5)
	const moonMesh = buildOrbitObject(moon, orbitCurve)

	const scene = Global.getScene()
	const interactionManager = Global.getInteractionManager()
	scene.add(orbitMesh)
	interactionManager.add(moonMesh)
	scene.add(moonMesh)
}

function buildOrbitObject(orbitObject: OrbitObject, orbitCurve: THREE.EllipseCurve): THREE.Mesh {
	const planetGeometry = new THREE.SphereGeometry(1, 32, 32)
	const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	planetMesh.name = orbitObject.englishName

	planetMesh.addEventListener("click" as any, ({ target }) => handlePlanetClick(orbitObject, target))

	planetMesh.scale.set(
		orbitObject.equaRadius * 2 * PLANET_SCALE,
		orbitObject.equaRadius * 2 * PLANET_SCALE,
		orbitObject.polarRadius * 2 * PLANET_SCALE
	)

	const planetPosition = orbitCurve.getPoint(orbitObject.mainAnomaly)
	planetMesh.position.set(planetPosition.x, planetPosition.y, 0)
	return planetMesh
}

function createOrbit(orbitObject: OrbitObject, xOffset: number = 0, yOffset: number = 0, scaleUp: number = 1): { orbitCurve: THREE.EllipseCurve, orbitMesh: THREE.Line } {
	const majorAxis = orbitObject.semimajorAxis * 2 * scaleUp
	const orbitCurve = new THREE.EllipseCurve(
		xOffset,
		yOffset,
		majorAxis,
		majorAxis * (1 - orbitObject.eccentricity),
		0,
		2 * Math.PI,
		false,
		orbitObject.longAscNode
	)

	const orbitPoints = orbitCurve.getPoints(360)

	const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
	// orbitGeometry.rotateY(planet.inclination / 360)

	const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

	const orbitMesh = new THREE.Line(orbitGeometry, orbitMaterial)
	return { orbitCurve: orbitCurve, orbitMesh: orbitMesh }
}


function addPlanetOption(planet: Planet, planetMesh: THREE.Mesh) {
	const objects = document.getElementById("objects")!
	const optionDiv = document.createElement("div")
	optionDiv.innerText = planet.englishName

	optionDiv.addEventListener("click", () => handlePlanetClick(planet, planetMesh))

	objects.appendChild(optionDiv)
}

export { buildScene }
