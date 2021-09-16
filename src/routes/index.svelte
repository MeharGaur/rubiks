<!--—————————— MARKUP ——————————-->

<canvas bind:this={canvas} on:dblclick={() => {
  cube.solve()
  // cube.move(`D2 R' D' F2 B D R2 D2 R' F2 D' F2 U' B2 L2 U2 D R2 U`)
  // cube.move(`L L' R R' U U' D D' F F' B B' M M' E E' S S'`)
}} />

<ActionBar
  on:scramble={ () => cube.scramble() } 
  on:solve={ () => cube.solve() } 
/>

<!--—————————— SCRIPTS ——————————-->

<script context="module">
	export const ssr = false
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import { AxesHelper, Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

  import Cube from '$lib/Cube'
  import ActionBar from '$lib/components/ActionBar.svelte';

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

      // TODO: Fix the canvas not resizing when window gets larger
      canvas.width = sizes.width
      canvas.height = sizes.height

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
      canvas: canvas,
      antialias: true
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x323232)

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
    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: none;
    user-select: none;
  }
</style>