import { buildScene } from "./scene"
import Global from "./state";

Global.createGlobals();

const renderer = Global.getRenderer();
const camera = Global.getCamera();

window.addEventListener("resize", () => {
	const canvas = renderer.domElement;
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
})

function animate() {
	requestAnimationFrame(animate)
	renderer.render(Global.getScene(), camera)

	Global.getInteractionManager().update()
	Global.getControls().update()
}

animate()

buildScene()
