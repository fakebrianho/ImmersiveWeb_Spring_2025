import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.01,
	10000
)

const mixers = []

const meshes = {}

const lights = {}

const scene = new THREE.Scene()

const controls = new OrbitControls(camera, renderer.domElement)
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
	camera.position.set(0, 0, 5)

	// const viewer = new GaussianSplats3D.DropInViewer({
	// 	gpuAcceleratedSort: true,
	// })
	// viewer.addSplatScenes([
	// 	{
	// 		path: './axle.ply',
	// 		splatAlphaRemovalThreshold: 5,
	// 	},
	// 	{
	// 		path: './axle.ply',
	// 		rotation: [0, -0.857, -0.514495, 6.123233995736766e-17],
	// 		scale: [2.5, 2.5, 2.5],
	// 		position: [0, 0, 0],
	// 	},
	// ])
	// scene.add(viewer)
	instances()
	resize()
	animate()
}
function instances() {
	const flowerExample = new Model({
		name: 'flower',
		scene: scene,
		meshes: meshes,
		url: '3_5_2025.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(0, -0.8, 3),
		// replace: true,
		// animationState: true,
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
		// meshes.flower.rotation.y -= 0.01
	}

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012

	renderer.render(scene, camera)
}
