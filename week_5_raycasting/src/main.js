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

const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
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
	raycast()
	resize()
	animate()
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children)
		console.log(intersects)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName === 'redBox') {
					const tl = new gsap.timeline()
					tl.to(meshes.default.scale, {
						x: 4,
						y: 4,
						z: 4,
						duration: 1,
						ease: 'power1',
					})
					tl.to(meshes.default.scale, {
						x: 1,
						y: 1,
						z: 1,
						duration: 1,
						ease: 'power1',
					})

					break
				}
				if (object.userData.groupName === 'flower') {
					gsap.to(meshes.flower.scale, {
						x: 5,
						y: 5,
						z: 5,
						duration: 1,
						ease: 'power1',
					})
					break
				}
				// if()
				object = object.parent
			}
		}
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
