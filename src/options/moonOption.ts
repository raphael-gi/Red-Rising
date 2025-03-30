import { MoonInterface } from "../types"
import Moon from "../scene/moon";
import Option from "./option";

class MoonOption extends Option<MoonInterface, Moon, "h5"> {
	constructor(moon: Moon) {
		super(moon, "h5")
		super.classList.add("moons")
	}
}

export default MoonOption;
