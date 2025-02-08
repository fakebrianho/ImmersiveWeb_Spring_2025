import { DirectionalLight } from 'three'

export const addLight = () => {
	const light = new DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
}
