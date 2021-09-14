import type { Object3D } from "three"
import { PRECISION } from "./Config"
import { Axes, CommandCode, Commands, Directions } from "./Types"


/**
 * IIFE that generates all the commands and associated metadata for a 3x3 rubik's cube
 * 
 * TODO: Refactor commands to use pieces array, not directly from the scene
 * 
 */
const commands = ((): Commands => {

  const clockwiseCommands: Commands = {
    leftClockwise: {
      code: <CommandCode> 'L',
      axis: Axes.X,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very left of the cube */
      selector: sortSelector((a, b) => a.position.x - b.position.x)
    },

    rightClockwise: {
      code: <CommandCode> 'R',
      axis: Axes.X,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very right of the cube */
      selector: sortSelector((a, b) => b.position.x - a.position.x)
    },

    upClockwise: {
      code: <CommandCode> 'U',
      axis: Axes.Y,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very top of the cube */
      selector: sortSelector((a, b) => b.position.y - a.position.y)
    },

    downClockwise: {
      code: <CommandCode> 'D',
      axis: Axes.Y,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very bottom of the cube */
      selector: sortSelector((a, b) => a.position.y - b.position.y)
    },

    frontClockwise: {
      code: <CommandCode> 'F',
      axis: Axes.Z,
      direction: Directions.Negative,
      /** Get all the pieces currently at the very front of the cube */
      selector: sortSelector((a, b) => b.position.z - a.position.z)
    },

    backClockwise: {
      code: <CommandCode> 'B',
      axis: Axes.Z,
      direction: Directions.Positive,
      /** Get all the pieces currently at the very back of the cube */
      selector: sortSelector((a, b) => a.position.z - b.position.z)
    },

    //

    middleClockwise: {
      code: <CommandCode> 'M',
      axis: Axes.X,
      direction: Directions.Positive,
      /** Get all the pieces currently where at the origin of the x-axis */
      selector: filterSelector((piece: Object3D) => (
        Math.abs(piece.position.x).toFixed(PRECISION) == (0).toFixed(PRECISION)
      ))
    },

    equatorClockwise: {
      code: <CommandCode> 'E',
      axis: Axes.Y,
      direction: Directions.Positive,
      /** Get all the pieces currently where at the origin of the x-axis */
      selector: filterSelector((piece: Object3D) => (
        Math.abs(piece.position.y).toFixed(PRECISION) == (0).toFixed(PRECISION)
      ))
    },

    standingClockwise: {
      code: <CommandCode> 'S',
      axis: Axes.Z,
      direction: Directions.Negative,
      /** Get all the pieces currently where at the origin of the x-axis */
      selector: filterSelector((piece: Object3D) => (
        Math.abs(piece.position.z).toFixed(PRECISION) == (0).toFixed(PRECISION)
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

function sortSelector(comparator: (a, b) => number) {
  return (pieces: Array<Object3D>) => (
    pieces
      .sort(comparator)
      .slice(0, 9)
  )
}

function filterSelector(predicate: (piece) => boolean) {
  return (pieces: Array<Object3D>) => (
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

  return Object.assign({ repetitions }, commands[commandName])
}


