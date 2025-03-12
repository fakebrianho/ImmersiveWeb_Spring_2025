import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { addTrack } from './addTrack'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

// Arrays and objects to store scene elements
const mixers = [] // Store animation mixers
const meshes = {} // Store all mesh objects
const lights = {} // Store all lightsu
const scene = new THREE.Scene()

// Scroll animation variables
let scrollProgress = 0 // Current position (0-1) along the track
let targetProgress = 0 // Target position to smooth towards
let scrollVelocity = 0 // Current scroll speed
const friction = 0.95 // Reduces velocity over time (must be < 1)
const acceleration = 0.000007 // How quickly scroll affects velocity
const maxVelocity = 0.05 // Maximum scroll speed
const debug = document.querySelector('.scrollProgress') // Debug display element
const totalDuration = 1
const cameraTG = new THREE.Vector3(0, 0, 0)
const timeline = new gsap.timeline({ paused: true })

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.physical = addTexturedMesh()
	meshes.track = addTrack().track
	meshes.debug = addTrack().debug

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.physical)
	scene.add(meshes.track)

	meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 5)

	initTimeline()
	instances()
	resize()
	handleScroll()
	animate()
}

function initTimeline() {
	// Define GSAP animations for different meshes
	// Scale up the flower model
	timeline.to(
		cameraTG,
		{
			x: 5,
			y: 5,
			z: 5,
			duration: totalDuration * 0.03,
		},
		0
	)
	timeline.to(
		cameraTG,
		{
			x: 8,
			y: 8,
			z: 8,
			duration: totalDuration * 0.15,
		},
		0.3
	)
	// Move default mesh to the right
	// timeline.to(
	// 	meshes.default.position,
	// 	{
	// 		x: 2,
	// 		duration: totalDuration * 0.08,
	// 	},
	// 	0.15 * totalDuration
	// )
	// // Move standard mesh to the left
	// timeline.to(
	// 	meshes.standard.position,
	// 	{
	// 		x: -2,
	// 		duration: totalDuration * 0.08,
	// 	},
	// 	0.35 * totalDuration
	// )
}

function updateCamera(scrollProgress) {
	// Get current position on the track
	const position =
		meshes.track.geometry.parameters.path.getPointAt(scrollProgress)

	// Look slightly ahead on the track
	// const lookAtPosition = meshes.track.geometry.parameters.path.getPointAt(
	// 	Math.min(scrollProgress + 0.01, 1)
	// )
	camera.position.copy(position)
	camera.lookAt(cameraTG)
	// camera.lookAt(lookAtPosition)

	console.log(cameraTG)
	// Update debug display if available
	if (debug) {
		debug.innerHTML = `Progress: ${scrollProgress.toFixed(
			3
		)} || Velocity: ${scrollVelocity.toFixed(5)} || Lookat: ${
			(cameraTG.x, cameraTG.y, cameraTG.z)
		}`
	}
}

function handleScroll() {
	// Convert wheel events into camera movement
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY
		scrollVelocity += scrollDelta * acceleration
		// Clamp velocity to maximum speed
		scrollVelocity = Math.max(
			Math.min(scrollVelocity, maxVelocity),
			-maxVelocity
		)
	})
}

function instances() {
	// Load and setup the animated flower model
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
	// Handle window resizing
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

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012

	// Update scroll-based camera movement
	targetProgress += scrollVelocity
	scrollVelocity *= friction // Apply friction to slow movement
	if (Math.abs(scrollVelocity < 0.0001)) {
		scrollVelocity = 0 // Stop completely at very low speeds
	}

	// Clamp progress to valid range
	targetProgress = Math.max(0, Math.min(targetProgress, 1))

	// Smoothly move toward target position
	scrollProgress += (targetProgress - scrollProgress) * 0.1
	updateCamera(scrollProgress)
	timeline.seek(scrollProgress)

	// Render the scene
	renderer.render(scene, camera)
}
