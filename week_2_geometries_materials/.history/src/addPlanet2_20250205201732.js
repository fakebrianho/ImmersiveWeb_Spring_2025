import { SphereGeometry, Mesh, MeshBasicMaterial } from 'three'

export const addPlanet2 = () => {
	const geometry = new SphereGeometry(0.2, 32, 16)
	const material = new MeshBasicMaterial({ color: 0xff02d4 })
	const mesh = new Mesh(geometry, mesh)
}
