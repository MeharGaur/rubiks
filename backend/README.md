# Backend for rubiks

using the popular [emscripten](https://emscripten.org/index.html) to compile the C program to a WebAssembly binary. It's just like gcc but supports wasm runtimes.


## Credits

Adapted from the C implementation of [muodov/kociemba](https://github.com/muodov/kociemba). This version compiles to a WebAssembly binary using emscripten.


## Compiling the binary

https://emscripten.org/docs/getting_started/Tutorial.html

Make sure your current directory is `src/lib/backend`, then just run `make`

the `bin` directory is where the backend.wasm binary will live, which can simply be imported through Vite on the JS side. 

More notes on building:
https://emscripten.org/docs/compiling/Building-Projects.html


## Testing the binary from terminal

Run `node bin/backend.cjs CUBE_DEFINITION` where CUBE_DEFINITION is a cube definition string. For example, `DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD`.

How [cube string notation](https://github.com/muodov/kociemba#cube-string-notation) works.
