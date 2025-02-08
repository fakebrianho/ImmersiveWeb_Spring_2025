//default imports, importing THREE so we can actually use THREE.js
//Importing our css, and importing our new helper functions that we made in class that return our lights, and meshes
import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import { addPlanet } from './addPlanet'

//Step 1 of our setup always revolves around our 3 essential characters, our camera, our renderer and our scene, by default we're always using the THREE.WebGLRenderer in this class
const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

//This is our default camera the perspective camera that imitates real life dimensions and proportions, just to recap the 4 parameters we pass in are: (Field of View, Aspect Ratio, Near Frustum, Far Frustum) aka (how wide can we see, what is the proportions of our screen, how close can our camera see, how far can our camera see)
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

//We use a lot of global variables in three.js so I like to create an object to store all of our meshes so that we can always refer back to a single place for our meshes.
const meshes = {}

//Similarly I group all our lights in an object as well so I can always refer back to these two objects as the location of my lights and meshes
const lights = {}

//Our scene, the 3d world we're creating, everything in the world we want must be added into this scene.
const scene = new THREE.Scene()

//Our version of a setup function, this isn't required by the library the same way it is in P5.js but I think it's good practice, generally when creating a new scene/world there are a lot of things we simply want to setup or run for the very first time, for example, intro cutscenes, dialogue, instructions etc, we generally want these to run once and at the beginning. Common practice to have an init function to do all of these
init()
function init() {
	// set up our renderer default settings, aka where we render our scene to on our website
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//add meshes to our meshes object
	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.planet1 = addPlanet(new THREE.Color(0xff0000), 0.2)
	meshes.planet2 = addPlanet(new THREE.Color(0xd7d7d7), 0.4)
	meshes.planet3 = addPlanet(new THREE.Color(0x00ff00), 0.3)
	meshes.planet4 = addPlanet(new THREE.Color(0x0000ff), 0.35)

	//add lights to our lights object
	lights.default = addLight()

	//add meshes to our scene
	scene.add(lights.default)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	scene.add(meshes.planet1)
	scene.add(meshes.planet2)
	scene.add(meshes.planet3)
	scene.add(meshes.planet4)

	//we set our camera position to x = 0, y = 0, z = 5
	camera.position.set(0, 0, 5)
	resize()
	animate()
}

//this is just a helpful function that helps us when our screen resizes
//don't worry too much about it
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

// here is our 'draw' loop, we just want to run the same function over and over again and every single frame tell our renderer to render the scene based on what our camera sees
function animate() {
	const tick = clock.getElapsedTime()
	console.log(tick)
	//request animation frame will call (animate) which then calls request animation frame which then etc etc...
	requestAnimationFrame(animate)

	//here we're referring to our meshes we stored in default and standard and just adding some rotation to them every frame, what's happening here is every time animate is called the code is looking at the meshes.default rotation so it probably starts like (0, 0, 0) and here sets it to (0+0.01, 0 - 0.01, 0 -0.02) then next frame when it looks up the rotation it is no longer starting at (0, 0, 0) it's now (0.01, -0.01, -0.02) and then it does it again so it turns that into (0.01 + 0.01, -0.01 - 0.01, -0.02 - 0.02) it looks up and does the calc 60 times a second creating animation!
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012

	meshes.default.position.x = Math.sin(tick * 2) * 2
	meshes.default.position.y = Math.cos(tick * 2) * 2

	meshes.planet1.position.x = Math.sin(tick * 2)
	meshes.planet1.position.y = Math.cos(tick * 2)

	meshes.planet2.position.x = Math.sin(-tick * 1.3) * 2
	meshes.planet2.position.y = Math.cos(-tick * 1.3) * 2

	meshes.planet3.position.x = Math.sin(tick * 0.6) * 3
	meshes.planet3.position.y = Math.cos(tick * 0.6) * 3

	// console.log(meshes.default.position)

	// our key render function, we call render and we pass in the scene and camera, the world and the view we see it from and let the renderer do all the hard math.
	renderer.render(scene, camera)
}
