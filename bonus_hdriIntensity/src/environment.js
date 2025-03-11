import { RGBELoader } from 'three/examples/jsm/Addons.js'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI() {
	const rgbeLoader = new RGBELoader()
	const hdrMap = rgbeLoader.load('hdri.hdr', (envMap) => {
		envMap.mapping = EquirectangularReflectionMapping
		return envMap
	})
	return hdrMap
}
