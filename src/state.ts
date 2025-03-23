import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { InteractionManager } from "three.interactive";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Global {
	private static global: Global;

	private scene: Scene;
	private renderer: WebGLRenderer;
	private camera: PerspectiveCamera;
	private controls: OrbitControls;
	private interactionManager: InteractionManager;

	public static createGlobals() {
		this.global = new Global();
	}

	constructor() {
		this.scene = new Scene();

		this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000000000);
		this.camera.position.set(0, 0, 500000000)
		this.camera.up.set(0, 0, 1)

		this.renderer = new WebGLRenderer({ canvas: document.querySelector("#app")! });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.interactionManager = new InteractionManager(this.renderer, this.camera, this.renderer.domElement);
	}

	public static getScene(): Scene {
		return this.global.scene;
	}

	public static getRenderer(): WebGLRenderer {
		return this.global.renderer;
	}

	public static getCamera(): PerspectiveCamera {
		return this.global.camera;
	}

	public static getControls(): OrbitControls {
		return this.global.controls;
	}

	public static getInteractionManager(): InteractionManager {
		return this.global.interactionManager;
	}
}

export default Global;
