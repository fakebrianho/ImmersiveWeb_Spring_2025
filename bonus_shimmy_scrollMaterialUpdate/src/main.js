import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
} from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { WheelAdaptor } from 'three-story-controls'

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

//set up our texture loader
const tLoader = new THREE.TextureLoader()
//array holding all our matcap urls
const arrMatcaps = ['1.png', '2.png', '3.png', 'mat.png']
//counter to index through ^ array
let counter = 0

//our wheel adaptor setup
const wheel = new WheelAdaptor({ type: 'discrete' })
wheel.connect()
wheel.addEventListener('trigger', () => {
	//increment our counter each time we scroll
	counter = (counter + 1) % arrMatcaps.length
	//check if our meshes.flower exists
	if (meshes.flower) {
		//if meshes.flower exists then we create a new matcap material with the new matcap
		const replacementMaterial = new THREE.MeshMatcapMaterial({
			map: tLoader.load(arrMatcaps[counter]),
		})
		//we traverse the mesh for all meshes since 3d models are often groups of smaller individual 3d models
		//for each mesh we find we replace the material with our new material
		meshes.flower.traverse((child) => {
			if (child.isMesh) {
				child.material = replacementMaterial
			}
		})
	}
	// if (currentSlide < slides.length - 1) {
	// 	currentSlide++
	// } else {
	// 	currentSlide = 0
	// }
	// gsap.to(camera.position, {
	// 	y: currentSlide * -10,
	// 	duration: 2,
	// 	ease: 'back.inOut',
	// })
})
init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.physical = addTexturedMesh()

	lights.default = addLight()

	scene.add(lights.default)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(meshes.physical)

	meshes.physical.position.set(-2, 2, 0)
	camera.position.set(0, 0, 5)
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

	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.y -= 0.01
	// meshes.default.rotation.z -= 0.02

	// meshes.standard.rotation.x += 0.01
	// meshes.standard.rotation.y += 0.02
	// meshes.standard.rotation.z -= 0.012

	renderer.render(scene, camera)
}
