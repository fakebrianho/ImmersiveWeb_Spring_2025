import {
	TubeGeometry,
	MeshBasicMaterial,
	DoubleSide,
	Mesh,
	Group,
	Vector3,
	CatmullRomCurve3,
	SphereGeometry,
} from 'three'

export const addTrack = () => {
	// Create a group to hold all debug points
	const group = new Group()

	// Define control points for the track curve
	// Each point is a 3D vector with (x, y, z) coordinates
	const points = [
		new Vector3(-10, 0, 10),
		new Vector3(-5, 0, 5),
		new Vector3(0, 0, 0),
		new Vector3(5, -5, 5),
		new Vector3(10, 0, 10),
		new Vector3(20, 5, 14),
		new Vector3(25, 0, 18),
	]

	// Create visual markers (red spheres) for each control point
	const sphereGeometry = new SphereGeometry(0.5)
	const sphereMaterial = new MeshBasicMaterial({
		color: 'red',
	})
	// Add a sphere at each control point for debugging/visualization
	points.forEach((point) => {
		const sphere = new Mesh(sphereGeometry, sphereMaterial)
		sphere.position.copy(point)
		group.add(sphere)
	})

	// Create a smooth curve through all control points
	const curve = new CatmullRomCurve3(points)

	// Create a tube geometry that follows the curve
	const geometry = new TubeGeometry(
		curve, // The curve to follow
		100, // Number of segments (higher = smoother)
		2, // Tube radius
		8, // Number of sides (higher = rounder tube)
		true // Closed loop (connects end to start)
	)

	// Create material for the tube
	const material = new MeshBasicMaterial({
		wireframe: true,
		side: DoubleSide,
		color: 0xffffff,
		visible: false,
	})
	const tube = new Mesh(geometry, material)

	// Return both the debug points group and the track tube
	return { debug: group, track: tube }
}
