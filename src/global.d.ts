/// <reference types="@sveltejs/kit" />

/// <reference types="@types/three" />

/// <reference path="service-worker.d.ts" />


interface Module {
  [key: string]: any
}

declare var Module: Module;