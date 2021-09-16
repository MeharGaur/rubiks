import { Axes, Directions } from "./Types"
import type { CommandCode, Commands } from "./Types"
import type { Piece } from "./Piece"
import { PRECISION } from "./Config"


/**
 * IIFE that generates all the commands and associated metadata for a 3x3 rubik's cube
 */
const commands = ((): Commands => {

  const clockwiseCommands: Commands = {
    leftClockwise: {
      code: <CommandCode> 'L',
      axis: Axes.X,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very left of the cube */
      selector: sortSelector((a, b) => a.mesh.position.x - b.mesh.position.x)
    },

    rightClockwise: {
      code: <CommandCode> 'R',
      axis: Axes.X,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very right of the cube */
      selector: sortSelector((a, b) => b.mesh.position.x - a.mesh.position.x)
    },

    upClockwise: {
      code: <CommandCode> 'U',
      axis: Axes.Y,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very top of the cube */
      selector: sortSelector((a, b) => b.mesh.position.y - a.mesh.position.y)
    },

    downClockwise: {
      code: <CommandCode> 'D',
      axis: Axes.Y,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very bottom of the cube */
      selector: sortSelector((a, b) => a.mesh.position.y - b.mesh.position.y)
    },

    frontClockwise: {
      code: <CommandCode> 'F',
      axis: Axes.Z,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very front of the cube */
      selector: sortSelector((a, b) => b.mesh.position.z - a.mesh.position.z)
    },

    backClockwise: {
      code: <CommandCode> 'B',
      axis: Axes.Z,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very back of the cube */
      selector: sortSelector((a, b) => a.mesh.position.z - b.mesh.position.z)
    },

    //

    middleClockwise: {
      code: <CommandCode> 'M',
      axis: Axes.X,
      direction: Directions.Positive,
      /** Get all the pieces currently at the origin of the x-axis */
      selector: filterSelector((piece) => (
        Math.abs(piece.mesh.position.x).toFixed(PRECISION) == (0).toFixed(PRECISION)
      ))
    },

    equatorClockwise: {
      code: <CommandCode> 'E',
      axis: Axes.Y,
      direction: Directions.Positive,
      /** Get all the pieces currently at the origin of the y-axis */
      selector: filterSelector((piece) => (
        Math.abs(piece.mesh.position.y).toFixed(PRECISION) == (0).toFixed(PRECISION)
      ))
    },

    standingClockwise: {
      code: <CommandCode> 'S',
      axis: Axes.Z,
      direction: Directions.Negative,
      /** Get all the pieces currently at the origin of the z-axis */
      selector: filterSelector((piece) => (
        Math.abs(piece.mesh.position.z).toFixed(PRECISION) == (0).toFixed(PRECISION)
      ))
    },
  }

  // Generate counterClockwise commands as well

  const counterClockwiseCommands: Commands = { }

  for (const clockwiseName in clockwiseCommands) {
    const counterClockwiseName = clockwiseName.replace(/([A-Z])/g, "Counter$1")

    counterClockwiseCommands[counterClockwiseName] = {
      ...clockwiseCommands[clockwiseName]
    }
    counterClockwiseCommands[counterClockwiseName].code += `'`

    if (counterClockwiseCommands[counterClockwiseName].direction == Directions.Positive) {
      counterClockwiseCommands[counterClockwiseName].direction = Directions.Negative
    }
    else if (counterClockwiseCommands[counterClockwiseName].direction == Directions.Negative) {
      counterClockwiseCommands[counterClockwiseName].direction = Directions.Positive
    }
  }

  return {
    ...clockwiseCommands,

    ...counterClockwiseCommands
  }

})()

//

function sortSelector(comparator: (a: Piece, b: Piece) => number) {
  return (pieces: Array<Piece>) => (
    pieces
      .sort(comparator)
      .slice(0, 9)
  )
}

function filterSelector(predicate: (piece: Piece) => boolean) {
  return (pieces: Array<Piece>) => (
    pieces
      .filter(predicate)
      .slice(0, 9)
  )
}

//

/** 
 * Find the right Command object from given code. Shallow clone it cause 
 * it's passed by reference, don't want to mutate global commands object.
 */
export function getCommandByCode(code: CommandCode, repetitions: number) {
  const commandName = Object.keys(commands)
    .find(key => commands[key].code == code)

  if (commands[commandName]) {
    return Object.assign({ repetitions }, commands[commandName])
  }
  else {
    return undefined
  }
}


