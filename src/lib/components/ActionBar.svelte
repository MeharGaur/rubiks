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
      margin-bottom: 27px;
      padding-left: 0;

      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;

      li {
        button {
          cursor: pointer;

          min-width: 148px;
          margin: 0 33px;
          padding: 14px 25px;
          border: 2px solid #EEE;
          background-color: transparent;
          color: #FFF;
          font-size: 20px;
          border-radius: 30px;
          transition: 300ms ease;
          transition-property: background-color, color, box-shadow;

          &:hover {
            background-color: white;
            color: black;
          }

          &:focus {
            outline: none;
            box-shadow: 0px 0px 25px white;
          }
        }
      }
    }
  }
</style>
