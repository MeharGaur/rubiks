import { Axes, Colors, Directions } from "./Types"
import type { PieceData } from './Types'

export const piecesData: Array<PieceData> = [
  
  {
    indices: { x: 0, y: 0, z: 0 },
    faceletPositions: [ 'D7', 'L7', 'B9' ]
  },

  {
    indices: { x: 0, y: 0, z: 1 },
    faceletPositions: [ 'D4', 'L8' ]
  },

  {
    indices: { x: 0, y: 0, z: 2 },
    faceletPositions: [ 'F7', 'D1', 'L9' ]
  },

  //

  {
    indices: { x: 0, y: 1, z: 0 },
    faceletPositions: [ 'L4', 'B6' ]
  },
  
  {
    indices: { x: 0, y: 1, z: 1 },
    faceletPositions: [ 'L5' ]
  },

  {
    indices: { x: 0, y: 1, z: 2 },
    faceletPositions: [ 'F4', 'L6' ]
  },

  //

  {
    indices: { x: 0, y: 2, z: 0 },
    faceletPositions: [ 'U1', 'L1', 'B3' ]
  },

  {
    indices: { x: 0, y: 2, z: 1 },
    faceletPositions: [ 'U4', 'L2' ]
  },

  {
    indices: { x: 0, y: 2, z: 2 },
    faceletPositions: [ 'U7', 'F1', 'L3' ]
  },

  // —————

  {
    indices: { x: 1, y: 0, z: 0 },
    faceletPositions: [ 'D8', 'B8' ]
  },

  {
    indices: { x: 1, y: 0, z: 1 },
    faceletPositions: [ 'D5' ]
  },

  {
    indices: { x: 1, y: 0, z: 2 },
    faceletPositions: [ 'D2', 'F8' ]
  },

  //

  {
    indices: { x: 1, y: 1, z: 0 },
    faceletPositions: [ 'B5' ]
  },

  {
    // isCore: true, -- this is the core piece
    indices: { x: 1, y: 1, z: 1 },
    faceletPositions: [ ]
  },

  {
    indices: { x: 1, y: 1, z: 2 },
    faceletPositions: [ 'F5' ]
  },

  //

  {
    indices: { x: 1, y: 2, z: 0 },
    faceletPositions: [ 'U2', 'B2' ]
  },

  {
    indices: { x: 1, y: 2, z: 1 },
    faceletPositions: [ 'U5' ]
  },

  {
    indices: { x: 1, y: 2, z: 2 },
    faceletPositions: [ 'U8', 'F2' ]
  },

  // —————

  {
    indices: { x: 2, y: 0, z: 0 },
    faceletPositions: [ 'R9', 'B7', 'D9' ]
  },

  {
    indices: { x: 2, y: 0, z: 1 },
    faceletPositions: [ 'R8', 'D6' ]
  },

  {
    indices: { x: 2, y: 0, z: 2 },
    faceletPositions: [ 'F9', 'R7', 'D3' ]
  },

  //

  {
    indices: { x: 2, y: 1, z: 0 },
    faceletPositions: [ 'R6', 'B4' ]
  },

  {
    indices: { x: 2, y: 1, z: 1 },
    faceletPositions: [ 'R5' ]
  },

  {
    indices: { x: 2, y: 1, z: 2 },
    faceletPositions: [ 'R4', 'F6' ]
  },

  //

  {
    indices: { x: 2, y: 2, z: 0 },
    faceletPositions: [ 'R3', 'B1', 'U3' ]
  },

  {
    indices: { x: 2, y: 2, z: 1 },
    faceletPositions: [ 'R2', 'U6' ]
  },

  {
    indices: { x: 2, y: 2, z: 2 },
    faceletPositions: [ 'R1', 'U9', 'F3' ]
  },

]


/**
 * Cube faces lookup to see which facelets of a Piece should be what color
 */
export const colorMap = {
  U: {
    colorHex: Colors.White,
    axis: Axes.Y, 
    axisDirection: Directions.Positive 
  },

  R: {
    colorHex: Colors.Red,
    axis: Axes.X, 
    axisDirection: Directions.Positive 
  },

  F: {
    colorHex: Colors.Green,
    axis: Axes.Z, 
    axisDirection: Directions.Positive
  },

  D: {
    colorHex: Colors.Yellow,
    axis: Axes.Y, 
    axisDirection: Directions.Negative
  },

  L: {
    colorHex: Colors.Orange,
    axis: Axes.X, 
    axisDirection: Directions.Negative
  },

  B: {
    colorHex: Colors.Blue,
    axis: Axes.Z, 
    axisDirection: Directions.Negative
  },
}

