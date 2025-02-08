import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export const addPlanet = (color, radius, _material) => {
	console.log(_material)
	// (radius, width segments, height segments)
	const geometry = new SphereGeometry(radius, 32, 16)
	const material = _material
	const mesh = new Mesh(geometry, material)
	return mesh
}
