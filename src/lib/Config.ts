// The config/parameters are hardcoded in this module

export const DIMENSIONS = 3

export const PIECE_SIZE = 1 /3

/**
 * Number of digits after the decimal. Used for selecting pieces from the 
 * scene. Note that precision higher than 3 seems to result in rounding
 * errors where not all pieces would get selected.
 * 
 * TODO: don't be a monkey brain, use Number.EPSILON to compare floats properly
 */
export const PRECISION = 3

/** https://github.com/muodov/kociemba#cube-string-notation */
export const SOLVED_CUBE = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
