import { Axes, Directions } from "./Types"

export const pieceData = [
  {
    isCorner: true,
    indices: { x: 0, y: 0, z: 0 },
    // ********** TODO: Facelets axis and axisDirection might not be needed as we can determine axis and direction just from the ColorCode
    // NOTE: If it only has one facelete then it's a middle, if it has two then normal, if it has three then corner. Don't need to hardcode it here
    facelets: {
      D7: { axis: 'y', axisDirection: Directions.Negative },
      L7: { axis: 'x', axisDirection: Directions.Negative },
      B9: { axis: 'z', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: false,
    indices: { x: 0, y: 0, z: 1 },
    facelets: {
      D4: { axis: 'y', axisDirection: Directions.Negative },
      L8: { axis: 'x', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: true,
    indices: { x: 0, y: 0, z: 2 },
    facelets: {
      F7: { axis: 'z', axisDirection: Directions.Positive },
      D1: { axis: 'y', axisDirection: Directions.Negative },
      L9: { axis: 'x', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: false,
    indices: { x: 0, y: 1, z: 0 },
    facelets: {
      L4: { axis: 'x', axisDirection: Directions.Negative },
      B6: { axis: 'z', axisDirection: Directions.Negative },
    }
  },
  
  {
    isCorner: false,
    indices: { x: 0, y: 1, z: 1 },
    facelets: {
      L5: { axis: 'x', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: false,
    indices: { x: 0, y: 1, z: 2 },
    facelets: {
      F4: { axis: 'z', axisDirection: Directions.Positive },
      L6: { axis: 'x', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: true,
    indices: { x: 0, y: 2, z: 0 },
    facelets: {
      U1: { axis: 'y', axisDirection: Directions.Positive },
      L1: { axis: 'x', axisDirection: Directions.Negative },
      B3: { axis: 'z', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: false,
    indices: { x: 0, y: 2, z: 1 },
    facelets: {
      U4: { axis: 'y', axisDirection: Directions.Positive },
      L2: { axis: 'x', axisDirection: Directions.Negative },
    }
  },

  {
    isCorner: true,
    indices: { x: 0, y: 2, z: 2 },
    facelets: {
      U7: { axis: 'y', axisDirection: Directions.Positive },
      F1: { axis: 'z', axisDirection: Directions.Positive },
      L3: { axis: 'x', axisDirection: Directions.Negative },
    }
  },
]

/**
 * Cube faces lookup to see which facelets of a Piece should be what color
 */
const faces = {
  U: {
    color: 'someColor like Red -- use an enum',
    axis: Axes.Y, 
    axisDirection: Directions.Positive 
  },

  R: {
    axis: Axes.X, 
    axisDirection: Directions.Positive 
  },

  F: {
    axis: Axes.Z, 
    axisDirection: Directions.Positive
  },

  D: {
    axis: Axes.Y, 
    axisDirection: Directions.Negative
  },

  L: {
    axis: Axes.X, 
    axisDirection: Directions.Negative
  },

  B: {
    axis: Axes.Z, 
    axisDirection: Directions.Negative
  },
}

