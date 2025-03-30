import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial } from "three"
import { OrbitObjectType } from "../types"

class Orbit extends Line {
	private orbitCurve: EllipseCurve;

	constructor(object: OrbitObjectType, xOffset: number = 0, yOffset: number = 0, scaleUp: number = 1) {
		const majorAxis = object.semimajorAxis * 2 * scaleUp
		const orbitCurve = new EllipseCurve(
			xOffset,
			yOffset,
			majorAxis,
			majorAxis * (1 - object.eccentricity),
			0,
			2 * Math.PI,
			false,
			object.longAscNode
		)

		const orbitPoints = orbitCurve.getPoints(360)

		const orbitGeometry = new BufferGeometry().setFromPoints(orbitPoints)
		// orbitGeometry.rotateY(planet.inclination / 360)

		const orbitMaterial = new LineBasicMaterial({ color: 0xffffff })

		super(orbitGeometry, orbitMaterial)

		this.orbitCurve = orbitCurve;
	}

	public getCurve(): EllipseCurve {
		return this.orbitCurve;
	}
}

export default Orbit;
