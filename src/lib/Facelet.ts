import type { Mesh } from "three"

export class Facelet {
  constructor(

    public pieceMesh: Mesh,
    public position: string, 
    public mesh: Mesh,
    public hexCode: number
    
  ) { }
}

//

/** Put each color at the right position in the buffer attribute array */
export function getIndexFromFace(face: string) {
  let index
      
  // Right face is index 0
  if (face == 'R') {
    index = 0
  }
  // Left face is index 1
  else if (face == 'L') {
    index = 1
  }
  // Up face is index 2
  else if (face == 'U') {
    index = 2
  }
  // Down face is index 3
  else if (face == 'D') {
    index = 3
  }
  // Front face is index 4
  else if (face == 'F') {
    index = 4
  }
  // Back face is index 5
  else if (face == 'B') {
    index = 5
  }

  return index
}
