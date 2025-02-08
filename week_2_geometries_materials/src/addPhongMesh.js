import { SphereGeometry, Mesh, MeshPhongMaterial } from 'three'

export const addPhongMesh = () => {
	const geometry = new SphereGeometry(0.5, 100, 100)
	const material = new MeshPhongMaterial({
		color: 0x00ff00,
		specular: 0xffffff,
		shininess: 200,
		emissive: 0xff0000,
	})
	const mesh = new Mesh(geometry, material)
	mesh.position.set(-3, 0, 0)
	return mesh
}
