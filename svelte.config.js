import preprocess from 'svelte-preprocess'
import adapterStatic from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapterStatic(),

    ssr: false,

    vite: {
      // Keep getting a "Must use import to load ES Module" error with ssr
      // ssr: {
      //   noExternal: [ 'three/examples/jsm/controls/OrbitControls' ]
      // }
    }
  },
}

export default config
