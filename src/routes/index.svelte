<!--—————————— MARKUP ——————————-->

<canvas bind:this={canvas} on:click={() => cube.parseCommandCodes('L R U')} />


<!--—————————— SCRIPTS ——————————-->

<script lang="ts">
  import { onMount } from 'svelte'

  import { AxesHelper, Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  import Cube from '$lib/frontend/Cube'

  // Canvas
  let canvas: HTMLCanvasElement
  let cube: Cube

  onMount(() => {

    // ————————— 3D World —————————
    
    // Scene
    const scene = new Scene()

    // Instantiate Rubiks Cube
    cube = new Cube(scene)

    // Axes Helper
    const axesHelper = new AxesHelper()
    scene.add(axesHelper)
    
    // ————————— WebGL Boilerplate —————————

    // Window & Resizing
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
    })

    // Camera
    const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 1
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    // Renderer
    const renderer = new WebGLRenderer({
      canvas: canvas
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Render Loop
    const clock = new Clock()

    function render() {
      const elapsedTime = clock.getElapsedTime()

      // Update controls
      controls.update()

      // Render to canvas
      renderer.render(scene, camera)

      // Call render again on the next frame
      window.requestAnimationFrame(render)
    }

    render()

    // Get rid of the WebGL context onDestroy
    return function onDestroy() {
      canvas = undefined
      renderer.dispose()

      renderer.getContext()
        .getExtension('WEBGL_lose_context')
        .loseContext()
    }

  })
</script>

<!--—————————— STYLES ——————————-->

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    overflow: hidden;
  }

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    user-select: none;
  }
</style>