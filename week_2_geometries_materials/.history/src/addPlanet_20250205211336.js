import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export const addPlanet = (color, radius, _material) => {
	// (radius, width segments, height segments)
	const geometry = new SphereGeometry(radius, 32, 16)
	const material = new _material({ color: color })
	const mesh = new Mesh(geometry, material)
	return mesh
}
