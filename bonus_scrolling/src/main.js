////LINK TO TIMELINE DOCUMENTATION https://gsap.com/docs/v3/GSAP/Timeline/
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

const timeline = new gsap.timeline({ paused: true })
let loadedFlag = false
const scrollSpeed = 0.1
let maxScrollPosition = 600
const totalDuration = maxScrollPosition / scrollSpeed
let currentPosition = 0
let targetPosition = 0
let velocity = 0
const friction = 0.75 // Reduces velocity over time
const spring = 0.01 // Controls bounce effect
const maxVelocity = 2 // Limits maximum scroll speed
const debug = document.querySelector('.scrollPosition')

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.default)
	scene.add(meshes.standard)

	camera.position.set(0, 0, 5)
	instances()
	handleScroll()
	resize()
	animate()
}

function handleScroll() {
	// Add smooth scrolling behavior with physics
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY || event.wheelDelta
		// Update velocity based on scroll input
		velocity += scrollDelta * 0.0005
		velocity = Math.max(Math.min(velocity, maxVelocity), -maxVelocity)
		// Update target position with clamping
		targetPosition += scrollDelta * 0.01
		targetPosition = Math.max(
			0,
			Math.min(targetPosition, maxScrollPosition)
		)
	})
}

function initTimeline() {
	// Define GSAP animations for different meshes
	// Scale up the flower model
	timeline.to(
		meshes.flower.scale,
		{
			x: 5,
			y: 5,
			z: 5,
			duration: totalDuration * 0.3,
		},
		0
	)
	// Move default mesh to the right
	timeline.to(
		meshes.default.position,
		{
			x: 2,
			duration: totalDuration * 0.08,
		},
		0.15 * totalDuration
	)
	// Move standard mesh to the left
	timeline.to(
		meshes.standard.position,
		{
			x: -2,
			duration: totalDuration * 0.08,
		},
		0.35 * totalDuration
	)
}

function instances() {
	// Create and initialize the flower model
	const flowerExample = new Model({
		name: 'flower',
		scene: scene,
		meshes: meshes,
		url: 'flowers.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(0, -0.8, 0),
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

	if (!loadedFlag) {
		if (meshes.flower) {
			loadedFlag = true
			initTimeline()
		}
	}

	// Apply spring physics to smooth scrolling
	const distance = targetPosition - currentPosition
	velocity += distance * spring
	velocity *= friction
	currentPosition += velocity

	// Update GSAP timeline based on scroll position
	const progress = currentPosition / maxScrollPosition
	const time = progress * totalDuration
	timeline.seek(time)

	// Update debug display
	debug.innerHTML = `Progress: ${progress.toFixed(
		3
	)} , Velocity: ${velocity.toFixed(3)}`

	renderer.render(scene, camera)
}
