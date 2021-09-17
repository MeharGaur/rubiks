import preprocess from 'svelte-preprocess'
import adapterStatic from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      // Global SCSS prepend
      prependData: `@import 'src/styles/prepend.scss';`
    }
  }),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapterStatic(),

    ssr: false,
  },
}

export default config
