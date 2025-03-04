import { SelectiveBloomEffect } from 'postprocessing'
import { EffectComposer } from 'postprocessing'
import { RenderPass } from 'postprocessing'
import { EffectPass } from 'postprocessing'

export function postprocessing(scene, camera, renderer, mesh) {
	const composer = new EffectComposer(renderer)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const selectiveBloom = new SelectiveBloomEffect(scene, camera, {
		intensity: 15.5,
		luminanceThreshold: 0.0001,
		mipmapBlur: true,
		radius: 0.45,
	})
	composer.addPass(new EffectPass(camera, selectiveBloom))

	return {
		composer: composer,
		selective: selectiveBloom,
	}
}
