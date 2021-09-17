import type { Mesh } from "three"

export class Facelet {
  constructor(

    public pieceMesh: Mesh,
    public position: string, 
    public mesh: Mesh,
    
  ) { }
}

