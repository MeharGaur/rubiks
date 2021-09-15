import { Vector3 } from 'three'
import type { Mesh } from 'three'
import { Colors } from './Types'
import type { PieceData } from './Types'
import type { Facelet } from './Facelet'

export class Piece {
  constructor(

    public indices: Vector3,
    public facelets: Array<Facelet>,
    public mesh: Mesh,

  ) { }
}

//

/**
 * TODO: This should be auto-generated for any size cube.
 * For a 3x3 cube it's just a triple-nested for loop to get the indices
 */
 export const piecesData: Array<PieceData> = [
  
  {
    indices: new Vector3(0, 0, 0),
    positions: [ 'D7', 'L7', 'B9' ]
  },

  {
    indices: new Vector3(0, 0, 1),
    positions: [ 'D4', 'L8' ]
  },

  {
    indices: new Vector3(0, 0, 2),
    positions: [ 'F7', 'D1', 'L9' ]
  },

  //

  {
    indices: new Vector3(0, 1, 0),
    positions: [ 'L4', 'B6' ]
  },
  
  {
    indices: new Vector3(0, 1, 1),
    positions: [ 'L5' ]
  },

  {
    indices: new Vector3(0, 1, 2),
    positions: [ 'F4', 'L6' ]
  },

  //

  {
    indices: new Vector3(0, 2, 0),
    positions: [ 'U1', 'L1', 'B3' ]
  },

  {
    indices: new Vector3(0, 2, 1),
    positions: [ 'U4', 'L2' ]
  },

  {
    indices: new Vector3(0, 2, 2),
    positions: [ 'U7', 'F1', 'L3' ]
  },

  // —————

  {
    indices: new Vector3(1, 0, 0),
    positions: [ 'D8', 'B8' ]
  },

  {
    indices: new Vector3(1, 0, 1),
    positions: [ 'D5' ]
  },

  {
    indices: new Vector3(1, 0, 2),
    positions: [ 'D2', 'F8' ]
  },

  //

  {
    indices: new Vector3(1, 1, 0),
    positions: [ 'B5' ]
  },

  {
    // isCore: true, -- this is the core piece at the very center of cube
    indices: new Vector3(1, 1, 1),
    positions: [ ]
  },

  {
    indices: new Vector3(1, 1, 2),
    positions: [ 'F5' ]
  },

  //

  {
    indices: new Vector3(1, 2, 0),
    positions: [ 'U2', 'B2' ]
  },

  {
    indices: new Vector3(1, 2, 1),
    positions: [ 'U5' ]
  },

  {
    indices: new Vector3(1, 2, 2),
    positions: [ 'U8', 'F2' ]
  },

  // —————

  {
    indices: new Vector3(2, 0, 0),
    positions: [ 'R9', 'B7', 'D9' ]
  },

  {
    indices: new Vector3(2, 0, 1),
    positions: [ 'R8', 'D6' ]
  },

  {
    indices: new Vector3(2, 0, 2),
    positions: [ 'F9', 'R7', 'D3' ]
  },

  //

  {
    indices: new Vector3(2, 1, 0),
    positions: [ 'R6', 'B4' ]
  },

  {
    indices: new Vector3(2, 1, 1),
    positions: [ 'R5' ]
  },

  {
    indices: new Vector3(2, 1, 2),
    positions: [ 'R4', 'F6' ]
  },

  //

  {
    indices: new Vector3(2, 2, 0),
    positions: [ 'R3', 'B1', 'U3' ]
  },

  {
    indices: new Vector3(2, 2, 1),
    positions: [ 'R2', 'U6' ]
  },

  {
    indices: new Vector3(2, 2, 2),
    positions: [ 'R1', 'U9', 'F3' ]
  },

]

//

/**
 * Cube faces lookup to see which facelets of a Piece should be what color
 */
export const colorMap = {
  U: Colors.White,

  R: Colors.Red,

  F: Colors.Green,

  D: Colors.Yellow,

  L: Colors.Orange,

  B: Colors.Blue,
}

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
