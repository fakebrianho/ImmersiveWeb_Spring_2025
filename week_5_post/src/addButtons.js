import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

export const addGreenButton = () => {
	const geometry = new SphereGeometry(0.35, 32, 64)
	const material = new MeshStandardMaterial({ color: 'green' })
	const mesh = new Mesh(geometry, material)
	mesh.userData.groupName = 'green'
	return mesh
}
export const addRedButton = () => {
	const geometry = new SphereGeometry(0.35, 32, 64)
	const material = new MeshStandardMaterial({ color: 'red' })
	const mesh = new Mesh(geometry, material)
	mesh.userData.groupName = 'red'
	return mesh
}
export const addBlackButton = () => {
	const geometry = new SphereGeometry(0.35, 32, 64)
	const material = new MeshStandardMaterial({ color: 'black' })
	const mesh = new Mesh(geometry, material)
	mesh.userData.groupName = 'black'
	return mesh
}

export const addYellowButton = () => {
	const geometry = new SphereGeometry(0.35, 32, 64)
	const material = new MeshStandardMaterial({ color: 'yellow' })
	const mesh = new Mesh(geometry, material)
	mesh.userData.groupName = 'yellow'
	return mesh
}
