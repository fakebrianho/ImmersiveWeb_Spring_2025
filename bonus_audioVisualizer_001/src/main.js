import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

// Arrays and objects to store animation mixers, meshes, and lights
const mixers = []
const meshes = {}
const lights = {}

const scene = new THREE.Scene()

// Select HTML elements for audio file input and audio playback
let file = document.querySelector('.audiofile')
let audio = document.querySelector('.audio')

// Variables for audio analysis
let analyser
let bufferTime
let dataArray
let averageAmplitude
let averageFreq

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

	loadAudio()
	resize()
	animate()
}

function initAudio() {
	// Create an audio context and connect it to the audio element
	const context = new AudioContext()
	const src = context.createMediaElementSource(audio)
	analyser = context.createAnalyser()
	src.connect(analyser)
	analyser.connect(context.destination)

	// Set up the analyser for frequency and time domain data
	analyser.fftSize = 512 // Determines the size of the FFT (Fast Fourier Transform) used for frequency analysis
	const bufferLength = analyser.frequencyBinCount // Half of fftSize, represents the number of data points in the frequency domain
	dataArray = new Uint8Array(bufferLength) // Array to hold frequency data
	bufferTime = new Uint8Array(bufferLength) // Array to hold time domain data
	analyser.getByteTimeDomainData(bufferTime) // Fills bufferTime with time domain data (waveform)
}

function loadAudio() {
	// Play audio on document load
	document.onload = () => {
		audio.play()
	}

	// Set up file input change event to load and play selected audio file
	file.onchange = (e) => {
		let file = e.target.files[0]
		if (file) {
			let fileURL = URL.createObjectURL(file)
			audio.src = fileURL
			audio.play()
			initAudio()
		}
	}
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

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.default.rotation.z -= 0.02

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.y += 0.02
	meshes.standard.rotation.z -= 0.012

	// Update audio data and scale meshes based on audio analysis
	if (analyser) {
		analyser.getByteFrequencyData(dataArray) // Fills dataArray with frequency data (amplitude of each frequency)
		analyser.getByteTimeDomainData(bufferTime) // Updates bufferTime with the current waveform data
		averageFreq = getAverageFrequency(dataArray) // Calculate average frequency amplitude
		averageAmplitude = getRMS(bufferTime) // Calculate root mean square of the waveform
		meshes.default.scale.x = averageFreq * 0.03
		meshes.default.scale.y = averageFreq * 0.03
		meshes.default.scale.z = averageFreq * 0.03
		meshes.standard.scale.x = averageAmplitude * 0.003
		meshes.standard.scale.y = averageAmplitude * 0.003
		meshes.standard.scale.z = averageAmplitude * 0.003
	}

	renderer.render(scene, camera)
}

function getAverageFrequency(dataArray) {
	// Calculate the average frequency from the frequency data array
	let value = 0
	const data = dataArray

	for (let i = 0; i < data.length; i++) {
		value += data[i]
	}

	return value / data.length
}

function getRMS(bufferTime) {
	// Calculate the root mean square (RMS) of the time domain data
	let bTime = bufferTime
	var rms = 0
	for (let i = 0; i < bTime.length; i++) {
		rms += bTime[i] * bTime[i]
	}
	rms /= bTime.length
	rms = Math.sqrt(rms)
	return rms
}
