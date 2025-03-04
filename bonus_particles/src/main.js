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
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)

const mixers = []

const meshes = {}

let progress = 0
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
	instances()
	resize()
	animate()
}
function createFlowField(points, time) {
	const positions = points.geometry.attributes.position

	// Store original positions if not already stored
	if (!points.userData.originalPositions) {
		const original = new Float32Array(positions.array.length)
		original.set(positions.array)
		points.userData.originalPositions = original

		// Also initialize particle velocities
		const velocities = new Float32Array(positions.count * 3)
		for (let i = 0; i < velocities.length; i++) {
			velocities[i] = 0
		}
		points.userData.velocities = velocities
	}

	const velocities = points.userData.velocities

	// Flow field parameters
	const fieldScale = 0.1 // Size of the flow field features
	const flowStrength = 0.01 // How strongly the field affects particles
	const damping = 0.98 // Friction to prevent excessive speeds
	const timeScale = 0.2 // How quickly the field evolves

	// Update each point independently
	for (let i = 0; i < positions.count; i++) {
		const i3 = i * 3

		// Current position
		const x = positions.array[i3]
		const y = positions.array[i3 + 1]
		const z = positions.array[i3 + 2]

		// Calculate flow field vector at this position
		const angle1 =
			Math.sin(x * fieldScale) +
			Math.cos(y * fieldScale + time * timeScale)
		const angle2 =
			Math.sin(y * fieldScale) +
			Math.cos(z * fieldScale + time * timeScale)
		const angle3 =
			Math.sin(z * fieldScale) +
			Math.cos(x * fieldScale + time * timeScale)

		// Convert angles to flow vectors
		const flowX = Math.sin(angle1)
		const flowY = Math.sin(angle2)
		const flowZ = Math.sin(angle3)

		// Apply flow to particle velocity (with damping)
		velocities[i3] = velocities[i3] * damping + flowX * flowStrength
		velocities[i3 + 1] = velocities[i3 + 1] * damping + flowY * flowStrength
		velocities[i3 + 2] = velocities[i3 + 2] * damping + flowZ * flowStrength

		// Update position with velocity
		positions.array[i3] += velocities[i3]
		positions.array[i3 + 1] += velocities[i3 + 1]
		positions.array[i3 + 2] += velocities[i3 + 2]
	}

	positions.needsUpdate = true
}
function instances() {
	const flowerExample = new Model({
		name: 'flower',
		scene: scene,
		meshes: meshes,
		url: 'flowers.glb',
		scale: new THREE.Vector3(3, 3, 3),
		pointAmount: 200,
		position: new THREE.Vector3(0, -1.0, 3),
	})
	flowerExample.initPoints()
}
function applyRandomNoiseToPoints(points, time) {
	const positions = points.geometry.attributes.position

	// Only create seeds once, not every frame
	if (!points.userData.seeds) {
		// Generate random seeds for each point
		const seeds = new Float32Array(positions.count * 3)
		for (let i = 0; i < seeds.length; i++) {
			seeds[i] = Math.random() * 1000 // Random offset for each component of each point
		}
		points.userData.seeds = seeds
	}

	const seeds = points.userData.seeds

	// Noise parameters
	const speed = 0.5 // How fast points move
	const amplitude = 0.1 // How far points move

	// Update each point with its own random movement
	for (let i = 0; i < positions.count; i++) {
		const i3 = i * 3

		// Each point gets its own noise pattern using its seed
		positions.array[i3] += Math.sin(time * speed + seeds[i3]) * amplitude
		positions.array[i3 + 1] +=
			Math.cos(time * speed + seeds[i3 + 1]) * amplitude
		positions.array[i3 + 2] +=
			Math.sin(time * speed + seeds[i3 + 2]) * amplitude
	}

	positions.needsUpdate = true
}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
function applySimpleNoiseToPoints(points, time) {
	const positions = points.geometry.attributes.position
	const originalPositions =
		points.userData.originalPositions || storeOriginalPositions(points)

	// Noise parameters - adjust these to change the look
	const noiseScale = 0.2 // How "zoomed in" the noise is
	const noiseStrength = 0.5 // How much the points move
	const timeScale = 0.1 // How fast the animation evolves

	for (let i = 0; i < positions.count; i++) {
		const i3 = i * 3

		// Get original position as base
		const xOrig = originalPositions[i3]
		const yOrig = originalPositions[i3 + 1]
		const zOrig = originalPositions[i3 + 2]

		// Generate simple 3D noise
		const nx =
			Math.sin(xOrig * noiseScale + time * timeScale) *
			Math.cos(yOrig * noiseScale + time * timeScale)
		const ny =
			Math.sin(yOrig * noiseScale + time * timeScale) *
			Math.cos(zOrig * noiseScale + time * timeScale)
		const nz =
			Math.sin(zOrig * noiseScale + time * timeScale) *
			Math.cos(xOrig * noiseScale + time * timeScale)

		// Apply noise to position
		positions.array[i3] = xOrig + nx * noiseStrength
		positions.array[i3 + 1] = yOrig + ny * noiseStrength
		positions.array[i3 + 2] = zOrig + nz * noiseStrength
	}

	positions.needsUpdate = true
}

// Helper function to store original positions
function storeOriginalPositions(points) {
	const positions = points.geometry.attributes.position
	const original = new Float32Array(positions.array.length)
	original.set(positions.array)
	points.userData.originalPositions = original
	return original
}

function animate() {
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

	for (const mixer of mixers) {
		mixer.update(delta)
	}
	if (meshes.flower) {
		// meshes.flower.rotation.y -= 0.01
		// createFlowField(meshes.flower.children[0], performance.now() * 0.001)
		console.log(meshes.flower.children[0])
	}

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012
	// console.log(scene)

	renderer.render(scene, camera)
}
