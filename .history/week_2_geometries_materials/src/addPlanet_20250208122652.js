import { SphereGeometry, Mesh } from 'three'

//An example of a modular function, we're accepting arguments radius and _material which we then sub in to create our geometry
// and in place of our material. Now we can reuse this function to create various 'planets'
export const addPlanet = (radius, _material) => {
	const geometry = new SphereGeometry(radius, 32, 16)
	const material = _material
	const mesh = new Mesh(geometry, material)
	return mesh
}
