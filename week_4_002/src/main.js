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

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
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
	// scene.add(meshes.physical)

	meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 5)
	//call our functions
	interactions()
	instances()
	resize()
	animate()
}
function interactions() {
	const b1 = document.querySelector('.button_1')
	const b2 = document.querySelector('.button_2')
	const textBox = document.querySelector('.textContainer')
	const text = document.querySelector('.info')
	b1.addEventListener('click', () => {
		text.innerHTML = 'My red box was selected!'
		gsap.to(meshes.default.scale, {
			x: meshes.default.scale.x + 1,
			y: meshes.default.scale.y + 1,
			z: meshes.default.scale.z + 1,
			duration: 1.5,
			ease: 'power3.inOut',
		})
		gsap.to(textBox, {
			opacity: 1,
			duration: 2,
		})
		gsap.to(textBox, {
			opacity: 0,
			duration: 2,
			delay: 2,
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

	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.y -= 0.01
	// meshes.default.rotation.z -= 0.02

	// meshes.standard.rotation.x += 0.01
	// meshes.standard.rotation.y += 0.02
	// meshes.standard.rotation.z -= 0.012

	renderer.render(scene, camera)
}
