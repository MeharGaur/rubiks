import type { Mesh, Vector3 } from 'three'

export default class Piece {
  
  facelets: Array<object>
  indices: Vector3
  mesh: Mesh

  constructor(indices, facelets, mesh) {
    this.facelets = facelets
    this.indices = indices
    this.mesh = mesh
  }

}

