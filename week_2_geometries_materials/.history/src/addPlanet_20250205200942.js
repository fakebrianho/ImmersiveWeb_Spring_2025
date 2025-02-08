import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export const addPlanet = () => {
	// (radius, width segments, height segments)
	const geometry = new SphereGeometry(0.5, 32, 16)
	const material = new MeshBasicMaterial({ color: 0x0000ff })
	const mesh = new Mesh(geometry, material)
	return mesh
}
