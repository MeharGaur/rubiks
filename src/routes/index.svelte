<!-- 
  In THREE/OGL You can't have an object with multiple parents. So same 
  piece can't be in multiple Groups. Workarounds:

      - Can transform each cube individually. This takes some math and is
      going to be finnicky. See https://mehar-lab.web.app/marble-rubiks-loop

      - Can make a group and reparent the cubes of only the layer that is 
      about to be turned. After rotating the layer (Group) and then deleting
      the Group, will the pieces stay in the right spot?
          - This is definitely simpler, abstracts away transformations logic
 -->


<!--—————————— MARKUP ——————————-->

<canvas bind:this={canvas} />


<!--—————————— SCRIPTS ——————————-->

<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  import Cube from '$lib/frontend/Cube'

  // Canvas
  let canvas: HTMLCanvasElement

  onMount(() => {
    
    // Scene
    const scene = new Scene()

    // Instantiate Rubiks Cube
    const cube = new Cube(scene)
    
    // 

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
    camera.position.z = 3
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
      renderer.context.getExtension('WEBGL_lose_context').loseContext()
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