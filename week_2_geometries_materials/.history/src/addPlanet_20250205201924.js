import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export const addPlanet = (color, radius) => {
	// (radius, width segments, height segments)
	const geometry = new SphereGeometry(0.5, 32, 16)
	const material = new MeshBasicMaterial({ color: color })
	const mesh = new Mesh(geometry, material)
	return mesh
}
