import './style.css'
import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const scene = new THREE.Scene()

init()
function init() {
	// set up our renderer default settings, aka where we render our scene to on our website
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
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
	renderer.render(scene, camera)
}
