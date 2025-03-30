import MoonOption from "./options/moonOption";
import PlanetOption from "./options/planetOption";
import { buildScene } from "./scene/scene"
import Global from "./state";

Global.createGlobals();

const renderer = Global.getRenderer();
const camera = Global.getCamera();

window.customElements.define('planet-option', PlanetOption, { extends: 'div' });
window.customElements.define('moon-option', MoonOption, { extends: 'div' });

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
