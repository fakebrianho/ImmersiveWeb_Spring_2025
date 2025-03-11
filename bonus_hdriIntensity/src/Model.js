//Importing all our different loaders and materials
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import {
	Color,
	AnimationMixer,
	PointsMaterial,
	Points,
	MeshMatcapMaterial,
	TextureLoader,
	Vector3,
	BufferGeometry,
	Float32BufferAttribute,
	AdditiveBlending,
	MeshBasicMaterial,
	Group,
	Mesh,
} from 'three'

//create our class, we're using a class since this is a modular template for loading various models
export default class Model {
	//this is akin to our setup function where we create a bunch of default states or variables
	constructor(obj) {
		//mostly taking the data like name, meshes, url etc we pass in and setting them as variables in our instance.
		this.name = obj.name
		this.meshes = obj.meshes
		this.file = obj.url
		this.scene = obj.scene
		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('./draco/')
		this.loader.setDRACOLoader(this.dracoLoader)
		this.textureLoader = new TextureLoader()
		//this structure is slightly different than the basic var name = value, we basically use the or operator || to set the default to false if obj.animationState or obj.replace is undefined. In the case we don't pass any values into either of those obj.animationState will be undefined and thus this will be resolved as this.animations = (undefined || false) aka this.animations = false
		this.animations = obj.animationState || false
		this.replaceMaterials = obj.replace || false
		//another expression that may not be super common, ? : is typical for ternary operators, again lets us conditionally set states, this looks like (true false statement) ? if true do this : else do this. -> obj.replaceURL is passed in it evaluates to true since it's not undefined or null so then we do the first line aka this.textureLoader.load(`${obj.replaceURL}`), if not then we use our default /mat.png
		//Why do we do this ternary operator? Well if obj.replaceURL isn't passed in we don't want to try and set our matcap to a value that doesn't exist, this way we only set it to the replaceURL if it exists otherwise we go to a fallback value
		this.defaultMatcap = obj.replaceURL
			? this.textureLoader.load(`${obj.replaceURL}`)
			: this.textureLoader.load('/mat.png')

		this.mixer = null
		this.mixers = obj.mixers
		this.defaultParticle = obj.particleURL
			? this.textureLoader.load(`${obj.particleURL}`)
			: this.textureLoader.load('/10.png')
		this.scale = obj.scale || new Vector3(1, 1, 1)
		this.position = obj.position || new Vector3(0, 0, 0)
		this.rotation = obj.rotation || new Vector3(0, 0, 0)
		this.palette = [
			new Color('#FAAD80'),
			new Color('#FF6767'),
			new Color('#FF3D68'),
			new Color('#A73489'),
		]
		this.callback = obj.callback
	}
	init() {
		//the meat and bones of the file, we load our models using our gltf loader
		this.loader.load(this.file, (gltf) => {
			this.mesh = gltf.scene.children[0]
			//if we set replace to true then we try to look through every element in our obj and change anything that's a material to our new material
			if (this.replaceMaterials) {
				const replacementMaterial = new MeshMatcapMaterial({
					matcap: this.defaultMatcap,
				})
				//intuitive naming, we traverse through every element and for each check if it's a mesh, if it's a mesh it must have a material and we sub it out for our new material
				gltf.scene.traverse((child) => {
					if (child.isMesh) {
						child.material = replacementMaterial
					}
				})
			}

			//if animations is set to true we load all the animations saved in the model to our animation mixer so we can manipulate them outside this class
			if (this.animations) {
				this.mixer = new AnimationMixer(gltf.scene)
				gltf.animations.forEach((clip) => {
					this.mixer.clipAction(clip).play()
				})
				this.mixers.push(this.mixer)
			}

			//we're taking the values we passed in and setting the values of our 3d model to said parameters, aka setting the positions, rotations and scale, and also adding the 3dmodel (gltf.scene) to our meshes object
			this.meshes[`${this.name}`] = gltf.scene
			this.meshes[`${this.name}`].position.set(
				this.position.x,
				this.position.y,
				this.position.z
			)
			this.meshes[`${this.name}`].scale.set(
				this.scale.x,
				this.scale.y,
				this.scale.z
			)
			this.meshes[`${this.name}`].rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			)
			this.meshes[`${this.name}`].userData.groupName = this.name
			if (this.callback) {
				this.callback(this.meshes[`${this.name}`])
			}
			this.scene.add(this.meshes[`${this.name}`])
		})
	}
	//ignore for now, WIP from my end
	initPoints() {
		this.loader.load(this.file, (gltf) => {
			const meshes = []
			const pointCloud = new Group()
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					meshes.push(child)
				}
			})
			for (const mesh of meshes) {
				pointCloud.add(this.createPoints(mesh))
			}
			console.log(pointCloud)
			this.meshes[`${this.name}`] = pointCloud
			this.meshes[`${this.name}`].scale.set(
				this.scale.x,
				this.scale.y,
				this.scale.z
			)
			this.meshes[`${this.name}`].position.set(
				this.position.x,
				this.position.y,
				this.position.z
			)
			this.meshes[`${this.name}`].rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			)
			this.scene.add(this.meshes[`${this.name}`])
		})
	}
	createPoints(_mesh) {
		const sampler = new MeshSurfaceSampler(_mesh).build()
		const numParticles = 3000
		const particlesPosition = new Float32Array(numParticles * 3)
		const particleColors = new Float32Array(numParticles * 3)
		const newPosition = new Vector3()
		for (let i = 0; i < numParticles; i++) {
			sampler.sample(newPosition)
			const color =
				this.palette[Math.floor(Math.random() * this.palette.length)]
			particleColors.set([color.r, color.g, color.b], i * 3)
			particlesPosition.set(
				[newPosition.x, newPosition.y, newPosition.z],
				i * 3
			)
		}
		const pointsGeometry = new BufferGeometry()
		pointsGeometry.setAttribute(
			'position',
			new Float32BufferAttribute(particlesPosition, 3)
		)
		pointsGeometry.setAttribute(
			'color',
			new Float32BufferAttribute(particleColors, 3)
		)
		const pointsMaterial = new PointsMaterial({
			vertexColors: true,
			transparent: true,
			alphaMap: this.defaultParticle,
			alphaTest: 0.001,
			depthWrite: false,
			blending: AdditiveBlending,
			size: 0.12,
		})
		const points = new Points(pointsGeometry, pointsMaterial)
		return points
	}
}
