import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import {
	addRedButton,
	addBlackButton,
	addGreenButton,
	addYellowButton,
} from './addButtons'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { postprocessing } from '../postprocessing'
import { HDRI } from './environment'
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

let composer

const hdri = HDRI()
scene.background = hdri
scene.environment = hdri

const interactables = []
const carParts = []

const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

let loadedFlag = false

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.blackButton = addBlackButton()
	meshes.redButton = addRedButton()
	meshes.greenButton = addGreenButton()
	meshes.yellowButton = addYellowButton()

	//positioining them
	meshes.greenButton.position.set(1, 2, 0)
	meshes.redButton.position.set(-3, 2, 0)
	meshes.blackButton.position.set(3, 2, 0)
	meshes.yellowButton.position.set(-1, 2, 0)

	scene.add(meshes.yellowButton)
	scene.add(meshes.redButton)
	scene.add(meshes.greenButton)
	scene.add(meshes.blackButton)

	interactables.push(meshes.greenButton)
	interactables.push(meshes.yellowButton)
	interactables.push(meshes.redButton)
	interactables.push(meshes.blackButton)

	// meshes.default = addBoilerPlateMeshes()
	// meshes.standard = addStandardMesh()
	// meshes.physical = addTexturedMesh()

	// lights.default = addLight()

	// scene.add(lights.default)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(meshes.physical)

	// meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 5)

	composer = postprocessing(scene, camera, renderer)

	raycast()
	instances()
	resize()
	animate()
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(interactables)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName === 'green') {
					const tl = new gsap.timeline()
					tl.to(composer.bloom, {
						strength: 0.8,
						duration: 0.5,
						onComplete: () => {
							carParts.map((part) => {
								part.material.color = new THREE.Color('green')
							})
						},
					})
					tl.to(composer.bloom, {
						strength: 0.1,
						duration: 0.5,
					})
					break
				} else if (object.userData.groupName === 'black') {
					const tl = new gsap.timeline()
					tl.to(composer.bloom, {
						strength: 0.8,
						duration: 0.5,
						onComplete: () => {
							carParts.map((part) => {
								part.material.color = new THREE.Color('black')
							})
						},
					})
					tl.to(composer.bloom, {
						strength: 0.1,
						duration: 0.5,
					})
					break
				} else if (object.userData.groupName === 'red') {
					const tl = new gsap.timeline()
					tl.to(composer.bloom, {
						strength: 0.8,
						duration: 0.5,
						onComplete: () => {
							carParts.map((part) => {
								part.material.color = new THREE.Color('red')
							})
						},
					})
					tl.to(composer.bloom, {
						strength: 0.1,
						duration: 0.5,
					})
					break
				} else if (object.userData.groupName === 'yellow') {
					const tl = new gsap.timeline()
					tl.to(composer.bloom, {
						strength: 0.8,
						duration: 0.5,
						onComplete: () => {
							carParts.map((part) => {
								part.material.color = new THREE.Color('yellow')
							})
						},
					})
					tl.to(composer.bloom, {
						strength: 0.1,
						duration: 0.5,
					})
					break
				}
			}
		}
	})
}

function setupConfigure() {
	meshes.car.traverse((part) => {
		if (part.name === 'Body_Body_1_0') {
			carParts.push(part)
		}
		if (
			part.name === 'Door_Left_Body_1_0' ||
			part.name === 'Door_Right_Body_1_0'
		) {
			carParts.push(part)
		}
	})
}
function instances() {
	const car = new Model({
		name: 'car',
		scene: scene,
		meshes: meshes,
		url: 'sports_lite.glb',
		scale: new THREE.Vector3(0.01, 0.01, 0.01),
		position: new THREE.Vector3(-2.5, -1, 1),
		rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
		// replace: true,
		// animationState: true,
		// mixers: mixers,
	})
	car.init()
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
		if (meshes.car && hdri) {
			loadedFlag = true
			gsap.to('.loader', {
				opacity: 0,
				duration: 1.75,
				ease: 'power3.out',
			})
			setupConfigure()
		}
	}
	composer.composer.render()
}
