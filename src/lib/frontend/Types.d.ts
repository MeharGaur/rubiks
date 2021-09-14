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


export type ColorCode = `U`  | `L`  | `F`  | `R`  | `B`  | `D`

export enum Colors {
  White = 0xFFFFFF,

  Orange = 0xFF5525,

  Green = 0x199B4C,

  Red = 0x891214,

  Blue = 0x0D48AC,

  Yellow = 0xFED52F
}

export enum Axes {
  X = 'x',

  Y = 'y',

  Z = 'z'
}

export enum Directions {
  Positive = '+',

  Negative = '-'
}

//

export interface Command {
  code: CommandCode

  repetitions?: number

  axis: Axes.X | Axes.Y | Axes.Z

  direction: Directions.Positive | Directions.Negative

  selector: (pieces: Array<Object3D>) => Array<Object3D>
}
 

interface Commands {
  [key: string]: Command
}


export type FaceletPosition = 'U1' | 'U2' | 'U3' | 'U4' | 'U5' | 'U6' | 'U7' | 'U8' | 'U9' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9'


