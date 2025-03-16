import * as THREE from "three"

function getId(id: string): HTMLElement { return document.getElementById(id)! }

const infoSection = getId("info")
const title = getId("infoTitle")
const closeButton = getId("closeButton")

function addOptionListener(id: string) {
	const listOption = getId(id);
	listOption.addEventListener("click", (event) => {
		console.log(event)
	})
}

closeButton.addEventListener("click", () => {
	infoSection.classList.remove("visible")
})

function handlePlanetClick(mesh: THREE.Mesh) {
	title.innerHTML = mesh.name
	infoSection.classList.add("visible")
}


export { handlePlanetClick, addOptionListener }
