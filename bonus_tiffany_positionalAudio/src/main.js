import './style.css'
import * as THREE from 'three'
import { addLight } from './addDefaultLights'
import Model from './Model'
import gsap from 'gsap'
import { addAudioNodes } from './addAudioNodes'
import { WheelAdaptor } from 'three-story-controls'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const mixers = [] // For animation mixers
const meshes = {} // Store all meshes
const lights = {} // Store all lights
const scene = new THREE.Scene()

// Animation state flag
let isAnimating = false

// Define camera positions for scroll animation
const positions = [
	{ x: 0, y: 0, z: 0 },
	{ x: 0, y: -50, z: 0 },
	{ x: 0, y: -100, z: 0 },
	{ x: 0, y: -150, z: 0 },
	{ x: 0, y: -200, z: 0 },
]

let counter = 0

// Audio setup - create audio listener and positional audio sources
const listener = new THREE.AudioListener()
const sound1 = new THREE.PositionalAudio(listener)
const sound2 = new THREE.PositionalAudio(listener)
const sound3 = new THREE.PositionalAudio(listener)
const sound4 = new THREE.PositionalAudio(listener)
const audioLoader = new THREE.AudioLoader()

// Load and configure audio1
audioLoader.load('/audio1.mp3', function (buffer) {
	sound1.setBuffer(buffer)
	sound1.setRefDistance(10)
	sound1.setRolloffFactor(5)
	sound1.setMaxDistance(200)
	sound1.setDistanceModel('exponential')
})

// Load and configure audio2
audioLoader.load('/audio2.mp3', function (buffer) {
	sound2.setBuffer(buffer)
	sound2.setRefDistance(10)
	sound2.setRolloffFactor(5)
	sound2.setMaxDistance(200)
	sound2.setDistanceModel('exponential')
})

// Load and configure audio3
audioLoader.load('/audio3.mp3', function (buffer) {
	sound3.setBuffer(buffer)
	sound3.setRefDistance(10)
	sound3.setRolloffFactor(5)
	sound3.setMaxDistance(200)
	sound3.setDistanceModel('exponential')
})

// Load and configure audio4
audioLoader.load('/audio4.mp3', function (buffer) {
	sound4.setBuffer(buffer)
	sound4.setRefDistance(10)
	sound4.setRolloffFactor(5)
	sound4.setMaxDistance(200)
	sound4.setDistanceModel('exponential')
})
camera.add(listener)

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	// Create audio nodes and attach sounds
	meshes.node1 = addAudioNodes()
	meshes.node2 = addAudioNodes()
	meshes.node3 = addAudioNodes()
	meshes.node4 = addAudioNodes()

	// Attach sounds to their respective nodes
	meshes.node1.add(sound1)
	meshes.node2.add(sound2)
	meshes.node3.add(sound3)
	meshes.node4.add(sound4)

	lights.default = addLight()

	// Position audio nodes vertically in space
	meshes.node1.position.set(0, -50, 0)
	meshes.node2.position.set(0, -100, 0)
	meshes.node3.position.set(0, -150, 0)
	meshes.node4.position.set(0, -200, 0)

	// Set initial camera position
	camera.position.set(0, 0, 5)

	// Add elements to scene
	scene.add(lights.default)
	scene.add(meshes.node1)
	scene.add(meshes.node2)
	scene.add(meshes.node3)
	scene.add(meshes.node4)

	// Add click event to play all sounds simultaneously this is necessary because Autoplay on the web
	// is strictly forbidden now.
	window.addEventListener('click', () => {
		sound1.play()
		sound2.play()
		sound3.play()
		sound4.play()
	})

	setupScroll()
	instances()
	resize()
	animate()
}

function setupScroll() {
	const wheel = new WheelAdaptor({ type: 'discrete' })
	wheel.connect()
	wheel.addEventListener('trigger', () => {
		if (isAnimating) return
		isAnimating = true
		counter = (counter + 1) % positions.length
		console.log(counter)
		console.log(positions[counter].y)
		// Animate camera to new position using GSAP
		gsap.to(camera.position, {
			y: positions[counter].y,
			duration: 1.4,
			ease: 'power3.inOut',
			onComplete: () => (isAnimating = false),
		})
	})
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
	// Animation loop
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if (meshes.flower) {
		meshes.flower.rotation.y -= 0.01
	}

	renderer.render(scene, camera)
}
