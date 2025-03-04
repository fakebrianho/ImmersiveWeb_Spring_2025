## Installation

To install the PMDRS postprocessing library, run the following command in your project directory:

```bash
npm install postprocessing
```

## Basic Setup

1. **Import the Library:**

    In your JavaScript file, import the necessary classes from the `postprocessing` library:

    ```javascript
    import { EffectComposer, RenderPass, GlitchPass } from 'postprocessing'
    ```

2. **Initialize the Composer:**

    Create an instance of `EffectComposer` and add a `RenderPass` to it, IMPORTANT: we're importing EffectComposer, RenderPass and EffectPass from the postprocessing library not from three.js. The names of classes are the same but we need to update our imports to use effectively.

    ```javascript
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    ```

3. **Add Effects:**

    Add desired effects, such as a `GlitchPass`, to the composer:

    ```javascript
    const glitchPass = new GlitchPass()
    composer.addPass(glitchPass)
    ```

4. **Render the Scene:**

    In your animation loop, replace the default renderer call with the composer:

    ```javascript
    function animate() {
    	requestAnimationFrame(animate)
    	composer.render()
    }
    animate()
    ```
