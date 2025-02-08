//import the light that we'll be using
import { DirectionalLight } from 'three'

export const addLight = () => {
	//we don't need to worry about the specifics of it for now but we're basically creating a light with an intensity of 1 and it's color is 0xffffff
	const light = new DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	//the most important part is that we're returning the light to whatever function called it.
	return light
}
