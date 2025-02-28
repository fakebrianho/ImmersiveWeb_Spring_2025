import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import gsap from 'gsap'
import { WheelAdaptor } from 'three-story-controls'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const mixers = []

const meshes = {}

const lights = {}

const scene = new THREE.Scene()

const wheel = new WheelAdaptor({ type: 'discrete' })
wheel.connect()
wheel.addEventListener('trigger', () => {
	const tl = new gsap.timeline()
	tl.to(meshes.default.position, {
		x: 4,
		duration: 3.5,
		onStart: () => console.log('Default mesh animation started'),
		onComplete: () => console.log('Default mesh animation completed'),
	})
	tl.to(
		meshes.standard.position,
		{
			y: 4,
			duration: 1.5,
			onStart: () => console.log('Standard mesh animation started'),
			onComplete: () => console.log('Standard mesh animation completed'),
		},
		'<25%'
		// <25% is 25% into the previous animation, -=2 is 2s overlap from the previous animation
		// '-=2'
	)
})

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	// meshes.physical = addTexturedMesh()

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.default)
	scene.add(meshes.standard)
	// scene.add(meshes.physical)

	// meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 5)
	instances()
	resize()
	animate()
}
function instances() {
	const flowerExample = new Model({
		name: 'flower',
		scene: scene,
		meshes: meshes,
		url: 'flowers.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(0, -0.8, 3),
		replace: true,
		animationState: true,
		mixers: mixers,
	})
	// flowerExample.init()
}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
console.log(Math.clamp)
function animate() {
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

	for (const mixer of mixers) {
		mixer.update(delta)
	}
	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.01
	}

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012

	renderer.render(scene, camera)
}
