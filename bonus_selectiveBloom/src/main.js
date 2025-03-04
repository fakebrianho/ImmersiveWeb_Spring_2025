import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import { postprocessing } from './postprocessing'
import { Selection } from 'postprocessing'
import Model from './Model'

const renderer = new THREE.WebGLRenderer({
	antialias: false,
	stencil: false,
	depth: false,
	powerPreference: 'high-performance',
})

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const mixers = []
const selected = []
let loaded = false
const meshes = {}

const lights = {}

const scene = new THREE.Scene()

let composer

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	composer = postprocessing(scene, camera, renderer)

	// meshes.default = addBoilerPlateMeshes()
	// meshes.standard = addStandardMesh()jjj5j5j5
	// meshes.physical = addTexturedMesh()

	lights.default = addLight()

	scene.add(lights.default)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
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
	flowerExample.init()
	const crystal_one = new Model({
		name: 'crystal_one',
		scene: scene,
		meshes: meshes,
		url: 'c1.glb',
		position: new THREE.Vector3(0, -1.5, 0),
	})
	crystal_one.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

	for (const mixer of mixers) {
		mixer.update(delta)
	}
	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.01
	}

	if (!loaded) {
		if (meshes.crystal_one) {
			loaded = true
			console.log(meshes.crystal_one)
			let selection = new Selection()
			meshes.crystal_one.traverse((child) => {
				if (child.isMesh) {
					selection.add(child)
				}
			})
			composer.selective.selection = selection
			console.log(composer.selective)
		}
	}

	composer.composer.render()
}
