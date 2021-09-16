<!--—————————— MARKUP ——————————-->

<nav>
  <ol>
    <li> 
      <button on:click={ () => dispatch('scramble') }>
        Scramble
      </button> 
    </li>
    <li>
      <button on:click={ () => dispatch('solve') }>
        Solve
      </button>
    </li>
  </ol>
</nav>

<!--—————————— SCRIPTS ——————————-->
<script>
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
</script>

<!--—————————— STYLES ——————————-->
<style lang="scss">
  nav {
    width: 100vw;
    position: absolute;
    bottom: 0; 
    left: 0;
    z-index: 1;
    // background-color: red;

    ol {
      list-style-type: none;
      margin-bottom: 25px;
      padding-left: 0;

      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;

      li {
        button {
          min-width: 100px;
          margin: 0 15px;
        }
      }
    }
  }
</style>
