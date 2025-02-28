import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { Vector2 } from 'three'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'

export function postprocessing(scene, camera, renderer) {
	//effect composer composes our effects
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.1
	composer.addPass(bloomPass)

	const pixelPass = new RenderPixelatedPass(6, scene, camera)
	pixelPass.pixelSize = 12
	pixelPass.normalEdgeStrength = 2
	// composer.addPass(pixelPass)

	const afterPass = new AfterimagePass()
	afterPass.uniforms.damp.value = 0.99
	afterPass.damp = 0
	// composer.addPass(afterPass)

	const glitchPass = new GlitchPass()
	glitchPass.enabled = true
	// glitchPass.goWild = true
	// composer.addPass(glitchPass)
	// const outlinePass = new OutlinePass(
	// 	new Vector2(window.innerWidth, window.innerHeight),
	// 	scene,
	// 	camera
	// )
	// composer.addPass(outlinePass)

	return {
		composer: composer,
		bloom: bloomPass,
	}
}
