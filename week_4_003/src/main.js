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

const positions = [
	{ x: 0, y: 0, z: 5 },
	{ x: 10, y: 0, z: 5 },
	{ x: 20, y: 0, z: 5 },
]

let index = 0
let isAnimating = false
//HOW TO USE WHEEL ADAPTOR
const wheel = new WheelAdaptor({ type: 'discrete' })
wheel.connect()
wheel.addEventListener('trigger', (event) => {
	// console.log(event)
	// if (event.y > 0) {
	index = (index + 1) % positions.length
	// } else {
	// index = (index - 1) % positions.length
	// }
	if (isAnimating) return
	isAnimating = true
	gsap.to(camera.position, {
		x: positions[index].x,
		duration: 1.75,
		ease: 'power3.inOut',
		onComplete: () => {
			isAnimating = false
		},
	})
})

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.position3 = addStandardMesh()

	lights.default = addLight()

	scene.add(lights.default)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(meshes.position3)
	// scene.add(meshes.physical)

	//setup my meshes positioning
	// meshes.default.position.set(0, 0, 0)
	// meshes.standard.position.set(10, 0, 0)
	// meshes.position3.position.set(20, 0, 0)

	// meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 3)
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

	const m1 = new Model({
		name: 'model1',
		scene: scene,
		meshes: meshes,
		url: 'm1.glb',
		position: new THREE.Vector3(0, -1.0, 0),
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		replace: true,
	})
	m1.init()
	const m2 = new Model({
		name: 'model2',
		scene: scene,
		meshes: meshes,
		url: 'm2.glb',
		position: new THREE.Vector3(10, -1, 0),
		replace: true,
	})
	m2.init()
	const m3 = new Model({
		name: 'model3',
		scene: scene,
		meshes: meshes,
		url: 'm3.glb',
		position: new THREE.Vector3(20, -1, 0),
		scale: new THREE.Vector3(4.5, 4.5, 4.5),
		replace: true,
	})
	m3.init()
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
	if (meshes.model1) {
		meshes.model1.rotation.y += 0.01
	}
	if (meshes.model2) {
		meshes.model2.rotation.y += 0.01
	}
	if (meshes.model3) {
		meshes.model3.rotation.y += 0.01
	}
	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.y -= 0.01
	// meshes.default.rotation.z -= 0.02

	// meshes.standard.rotation.x += 0.01
	// meshes.standard.rotation.y += 0.02
	// meshes.standard.rotation.z -= 0.012

	renderer.render(scene, camera)
}
