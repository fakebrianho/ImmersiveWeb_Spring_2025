# Three.js Positional Audio Implementation Guide

This guide provides a step-by-step approach to implementing 3D positional audio in Three.js, allowing you to create an immersive spatial audio experience where sound sources are placed in 3D space and respond to the listener's position.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
4. [Implementation](#implementation)
    - [Creating the Scene](#creating-the-scene)
    - [Adding the Audio Listener](#adding-the-audio-listener)
    - [Loading and Configuring Audio](#loading-and-configuring-audio)
    - [Positioning Audio Sources](#positioning-audio-sources)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Introduction

Positional audio in Three.js allows you to place sound sources in 3D space, creating a more realistic and immersive experience.

## Prerequisites

-   Audio files in a supported format (e.g., MP3)
-   A modern browser with WebAudio support

## Setup

1. **Clone the Repository:**

-   Quickstart our boiler plate either using github or degit.

2. **Install Dependencies:**

    npm install
    npm install gsap
    npm install three-story-controls

3. **Place Audio Files:**

    Place your audio files in the `public` directory, they can be named anything but for this demo:

    - audio1.mp3
    - audio2.mp3
    - audio3.mp3
    - audio4.mp3

4. **Run the Development Server:**

    npm run dev

## Implementation

### Creating the Scene

### Adding the Audio Listener

1. **Create an Audio Listener:**

    Add an audio listener to the camera to capture the audio environment.

    ```javascript
    const listener = new THREE.AudioListener()
    camera.add(listener)
    ```

### Loading and Configuring Audio

1. **Load Audio Files:**

    Use the `AudioLoader` to load your audio files.

    ```javascript
    const audioLoader = new THREE.AudioLoader()
    const sound1 = new THREE.PositionalAudio(listener)

    audioLoader.load('audio/audio1.mp3', function (buffer) {
    	sound1.setBuffer(buffer)
    	sound1.setRefDistance(20)
    	sound1.play()
    })
    ```

### Positioning Audio Sources

1. **Attach Audio to Objects:**

    Attach the positional audio to a mesh or object in the scene.

    ```javascript
    export const addAudioNodes = () => {
    	const geometry = new BoxGeometry(1, 1, 1)
    	const material = new MeshStandardMaterial({
    		color: 'green',
    	})
    	const mesh = new Mesh(geometry, material)
    	return mesh
    }
    meshes.node1 = addAudioNodes()
    meshes.node1.add(sound1)
    scene.add(meshes.node1)
    ```

2. **Position the Object:**

    Set the position of the object in the scene to determine where the sound originates.

    ```javascript
    meshes.node1.position.set(0, -50, 0)
    ```

## Best Practices

-   Use compressed audio formats like MP3 to reduce file size.

## Troubleshooting

-   **No Audio Playing:** Ensure the `AudioContext` is not suspended and verify audio file paths.
-   **Poor Performance:** Reduce the number of audio sources and optimize audio file sizes.
