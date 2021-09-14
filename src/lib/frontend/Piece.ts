import type { Mesh, Vector3 } from 'three'
import type { FaceletPosition } from './Types'

export default class Piece {
  
  facelets: Array<FaceletPosition>
  indices: Vector3
  mesh: Mesh

  constructor(colorCode, indices, mesh) {
    this.indices = indices
    this.mesh = mesh
  }

}
