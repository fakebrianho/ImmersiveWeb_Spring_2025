import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
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
	points()
	buffer()
	// instances()
	resize()
	animate()
}
function buffer() {
	const particlesGeometry = new THREE.BufferGeometry()
	const count = 500

	const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

	for (
		let i = 0;
		i < count * 3;
		i++ // Multiply by 3 for same reason
	) {
		positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
	}

	particlesGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute(positions, 3)
	)
	// console.log(particlesMaterial)
	const particlesMaterial = new THREE.PointsMaterial({
		size: 0.02,
		sizeAttenuation: true,
	})
	const particles = new THREE.Points(particlesGeometry, particlesMaterial)
	scene.add(particles)
}
function points() {
	const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
	const particlesMaterial = new THREE.PointsMaterial({
		size: 0.02,
		sizeAttenuation: true,
	})
	const particles = new THREE.Points(particlesGeometry, particlesMaterial)
	scene.add(particles)
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
