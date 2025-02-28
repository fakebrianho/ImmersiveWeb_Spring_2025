import { Mesh, MeshStandardMaterial, BoxGeometry } from 'three'
export const addAudioNodes = () => {
	const geometry = new BoxGeometry(1, 1, 1)
	const material = new MeshStandardMaterial({
		color: 'green',
	})
	const mesh = new Mesh(geometry, material)
	return mesh
}
