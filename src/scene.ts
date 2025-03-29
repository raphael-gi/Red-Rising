import * as THREE from "three"
import { getMoons, getPlanets, getSun } from "./api"
import { Moon, OrbitObject, Planet } from "./types";
import { handlePlanetClick } from "./events";
import Global from "./state";
import { PLANET_SCALE, PLANETS } from "./constants";

async function buildScene() {
	const planets: Planet[] = await getPlanets()
	const moons: Moon[] = await getMoons(planets);
	const sun: Planet = await getSun()

	const sunMesh = buildSun(sun)

	const interactionManager = Global.getInteractionManager()
	interactionManager.add(sunMesh)

	const scene = Global.getScene()
	scene.add(sunMesh)

	const options = new Map()

	planets.forEach((planet) => {
		const planetMoons: Moon[] = []
		moons.forEach((moon) => {
			if (moon.aroundPlanet.planet === planet.id) {
				planetMoons.push(moon)
			}
		})
		const { mesh, moonMeshes } = buildPlanet(planet, planetMoons)
		const option = getPlanetOption(planet, mesh, moonMeshes)
		options.set(planet.id, option)
	})
	const objects = document.getElementById("objects")!

	for (const key of Object.keys(PLANETS)) {
		objects.appendChild(options.get(key))
	}
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

function buildPlanet(planet: Planet, moons: Moon[]): { mesh: THREE.Mesh, moonMeshes: { moon: Moon, moonMesh: THREE.Mesh }[] } {
	const orbitCurve = createOrbit(planet)
	const { position, mesh} = buildOrbitObject(planet, orbitCurve)

	const moonMeshes = moons.map((moon) => {
		return { moon, moonMesh: buildMoon(position, moon) }
	})

	return { mesh, moonMeshes }
}

function buildMoon(planetPosition: THREE.Vector2, moon: Moon): THREE.Mesh {
	const orbitCurve = createOrbit(moon, planetPosition.x, planetPosition.y, PLANET_SCALE)
	const { mesh } = buildOrbitObject(moon, orbitCurve)
	return mesh
}

function buildOrbitObject(orbitObject: OrbitObject, orbitCurve: THREE.EllipseCurve): { position: THREE.Vector2, mesh: THREE.Mesh } {
	const planetGeometry = new THREE.SphereGeometry(1, 32, 32)
	const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const orbitObjectMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	orbitObjectMesh.name = orbitObject.englishName

	orbitObjectMesh.addEventListener("click" as any, ({ target }) => handlePlanetClick(orbitObject, target))

	const equaRadius = (orbitObject.equaRadius > 0 ? orbitObject.equaRadius : orbitObject.meanRadius) * 2 * PLANET_SCALE
	const polarRadius = (orbitObject.polarRadius > 0 ? orbitObject.polarRadius : orbitObject.meanRadius) * 2 * PLANET_SCALE

	orbitObjectMesh.scale.set(equaRadius, equaRadius, polarRadius)

	const orbitObjectPosition = orbitCurve.getPoint(orbitObject.mainAnomaly)
	orbitObjectMesh.position.set(orbitObjectPosition.x, orbitObjectPosition.y, 0)

	const scene = Global.getScene()
	const interactionManager = Global.getInteractionManager()
	interactionManager.add(orbitObjectMesh)
	scene.add(orbitObjectMesh)

	return { position: orbitObjectPosition, mesh: orbitObjectMesh }
}

function createOrbit(orbitObject: OrbitObject, xOffset: number = 0, yOffset: number = 0, scaleUp: number = 1): THREE.EllipseCurve {
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
	Global.getScene().add(orbitMesh)

	return orbitCurve
}


function getPlanetOption(planet: Planet, planetMesh: THREE.Mesh, moons: { moon: Moon, moonMesh: THREE.Mesh }[]): HTMLDivElement {
	const optionDiv = document.createElement("div")

	const planetTag = document.createElement("h3")
	planetTag.innerText = planet.englishName
	planetTag.addEventListener("click", () => handlePlanetClick(planet, planetMesh))

	const moonsDiv = document.createElement("div")
	moonsDiv.classList.add("moons")

	moons.forEach(({ moon, moonMesh }) => {
		const moonTag = document.createElement("h5")
		moonTag.innerText = moon.englishName
		moonTag.addEventListener("click", () => handlePlanetClick(moon, moonMesh))

		moonsDiv.appendChild(moonTag)
	})

	optionDiv.appendChild(planetTag)
	optionDiv.appendChild(moonsDiv)

	return optionDiv
}

export { buildScene }
