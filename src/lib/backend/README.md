# suh dude

we shall use the popular [emscripten](https://emscripten.org/index.html) to compile c/c++ to a WebAssembly binary. So it's just like gcc but supports web environments.


## Installing emscripten

https://emscripten.org/docs/getting_started/downloads.html


## Compiling the binary

https://emscripten.org/docs/getting_started/Tutorial.html

if your current directory is root of the project, i think all that's needed to compile is 
`em++ src/lib/backend/main.cpp -o src/lib/backend/bin/backend.wasm`

the `bin` directory is where the backend.wasm binary will live, which will simply get imported on the JS side. 

More notes on building:
https://emscripten.org/docs/compiling/Building-Projects.html
