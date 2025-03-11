import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { HDRI } from './environment'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

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

const hdr = HDRI()
scene.environment = hdr
scene.background = hdr

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(3, 0, 0)
//solution 1

// scene.environmentIntensity = 20

let loaded = false

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.physical = addTexturedMesh()

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.physical)

	meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 5, 10)
	camera.lookAt(new THREE.Vector3(3, 0, 0))
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
		// replace: true,
		animationState: true,
		mixers: mixers,
	})
	flowerExample.init()
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
	if (!loaded) {
		if (meshes.flower && hdr) {
			meshes.flower.traverse((child) => {
				if (child.isMesh) {
					child.material.envMap = scene.environment
					child.material.envMapIntensity = 20
					child.material.needsUpdate = true
				}
			})
			loaded = true
		}
	}

	renderer.render(scene, camera)
}
