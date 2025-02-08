import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addDefaultLights'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const meshes = {}
// {key: value}
const lights = {}

const scene = new THREE.Scene()

init()
function init() {
	// set up our renderer default settings, aka where we render our scene to on our website
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//add meshes to our meshes object
	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()

	//add lights to our lights object

	lights.default = addLight()

	//add meshes to our scene
	scene.add(lights.default)
	scene.add(meshes.default)
	scene.add(meshes.standard)

	camera.position.set(0, 0, 5)
	resize()
	animate()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)

	meshes.default.rotation.x += 0.01

	renderer.render(scene, camera)
}
