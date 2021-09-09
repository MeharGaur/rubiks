import type { Object3D } from "three"

/**
 * https://ruwix.com/the-rubiks-cube/notation/advanced/
 */
export type CommandCode = 

  // clockwise
  `U`  | `L`  | `F`  | `R`  | `B`  | `D`  |

  // counterClockwise
  `U'` | `L'` | `F'` | `R'` | `B'` | `D'` |

  // slice
  `M'` | `M'` | `E`  | `E'` | `S`  | `S'` |

  // double
  `u`  | `l`  | `f`  | `r`  | `b`  | `d`  |

  // inverseDouble
  `u'` | `l'` | `f'` | `r'` | `b'` | `d'` |

  // wholeCube
  `X`  | `X'` | `Y`  | `Y'` | `Z`  | `Z'` 


enum Axes {
  X = 'x',

  Y = 'y',

  Z = 'z'
}

//

export interface Command {
  code: CommandCode

  axis: Axes.X | Axes.Y | Axes.Z,

  direction: '+' | '-'

  selector: (pieces: Array<Object3D>) => Array<Object3D>
}
  

interface Commands {
  [key: string]: Command
}

/**
 * All the commands and associated metadata for a 3x3 rubik's cube
 * TODO: Figure out a way to automatically generate all this (for a cube of any size?)
 */
const commands: Commands = {

  leftClockwise: {
    code: <CommandCode> 'L',
    axis: Axes.X,
    direction: '+',
    /** 
     * Get all the pieces currently at the very left of the cube
     */
    selector(pieces: Array<Object3D>) {
      return pieces
        .sort((a, b) => a.position.x - b.position.x)
        .slice(0, 9)
    }
  },

  rightClockwise: {
    code: <CommandCode> 'R',
    axis: Axes.X,
    direction: '-',
    /** 
     * Get all the pieces currently at the very right of the cube
     */
    selector(pieces: Array<Object3D>) {
      return pieces
        .sort((a, b) => b.position.x - a.position.x)
        .slice(0, 9)
    }
  },

  // ... so and so forth

  upClockwise: {
    code: <CommandCode> 'U',
    axis: Axes.Y,
    direction: '-',
    /** 
     * Get all the pieces currently at the very top of the cube
     */
    selector(pieces: Array<Object3D>) {
      return pieces
        .sort((a, b) => b.position.y - a.position.y)
        .slice(0, 9)
    }
  },

}

//

/** 
 * Find the right Command object from given code
 */
export function getCommandByCode(code: CommandCode) {
 return commands[
   Object.keys(commands)
     .find(key => commands[key].code == code)
 ]
}


