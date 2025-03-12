// Create a manager for scroll-based animations
const ScrollAnimationManager = {
	animations: [],

	// Add an animation with its trigger range
	add(startPoint, endPoint, animationFn) {
		this.animations.push({
			start: startPoint,
			end: endPoint,
			animate: animationFn,
			timeline: null,
			active: false,
		})
	},

	// Update all animations based on current scroll progress
	update(scrollProgress) {
		this.animations.forEach((anim) => {
			// Check if we're in this animation's range
			if (scrollProgress >= anim.start && scrollProgress <= anim.end) {
				// If animation wasn't active before, initialize it
				if (!anim.active) {
					anim.timeline = anim.animate()
					anim.timeline.pause()
					anim.active = true
				}

				// Map the scroll progress to animation progress
				const animProgress =
					(scrollProgress - anim.start) / (anim.end - anim.start)
				anim.timeline.progress(animProgress)
			}
			// Handle when we exit the animation range
			else if (anim.active) {
				// Finalize animation state based on which side we exited
				if (scrollProgress < anim.start) {
					anim.timeline.progress(0)
				} else {
					anim.timeline.progress(1)
				}
				anim.active = false
			}
		})
	},
}
