<!--—————————— MARKUP ——————————-->
<svelte:head>
  <title>Rubiks — Mehar Gaur</title>
</svelte:head>

<canvas bind:this={canvas} />

<ActionBar
  on:scramble={ () => !cube.loading && cube.scramble() } 
  on:solve={ () => !cube.loading && cube.solve() } 
/>

<!--—————————— SCRIPTS ——————————-->

<script context="module">
	export const ssr = false
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import { AxesHelper, Clock, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

  import Cube from '$lib/Cube'
  import ActionBar from '$lib/components/ActionBar.svelte'

  // Canvas
  let canvas: HTMLCanvasElement

  let cube: Cube

  const sizes = { width: 0, height: 0 }

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
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      renderer.setSize(sizes.width, sizes.height)

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

    }, { passive: true })

    // Camera
    const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0.8
    camera.position.y = 0.85
    camera.position.z = 1.2

    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enablePan = false
    controls.target = new Vector3(0, -0.22, 0)

    // Renderer
    const renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x333333)

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
    right: 0;
    bottom: 0;
    left: 0;
    outline: none;
    user-select: none;
  }
</style>