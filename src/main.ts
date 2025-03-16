import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildScene } from "./scene"
import { InteractionManager } from "three.interactive";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000000000)

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#app")!
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.set(0, 0, 500000000)
camera.up.set(0, 0, 1)

const controls = new OrbitControls(camera, renderer.domElement)

const interactionManager = new InteractionManager(
	renderer,
	camera,
	renderer.domElement
)

window.addEventListener("resize", () => {
	const canvas = renderer.domElement;
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
})

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)

	interactionManager.update()
	controls.update()
}

animate()

buildScene(scene, camera, controls, interactionManager)
