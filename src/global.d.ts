/// <reference types="@sveltejs/kit" />

/// <reference types="@types/three" />

/// <reference path="service-worker.d.ts" />


// Emscripten's bloatware lol

interface Module {
  [key: string]: any
}

declare var Module: Module;