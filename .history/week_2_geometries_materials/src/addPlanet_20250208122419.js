import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export const addPlanet = (radius, _material) => {
	const geometry = new SphereGeometry(radius, 32, 16)
	const material = _material
	const mesh = new Mesh(geometry, material)
	return mesh
}
