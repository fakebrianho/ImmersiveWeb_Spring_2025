import { MeshLambertMaterial, Mesh, SphereGeometry } from 'three'

export const addLambertMesh = () => {
	const geometry = new SphereGeometry(1, 100, 100)
	const material = new MeshLambertMaterial({
		color: 0x0000ff,
		emissive: 0x00ff00,
	})
}
