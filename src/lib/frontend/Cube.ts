import { BoxGeometry, Color, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, Quaternion, Scene, Vector3 } from 'three'
import { gsap } from 'gsap'

import { getCommandByCode } from './Commands'
import type { Command, CommandCode } from './Types'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE, SOLVED_CUBE } from './Config'
import { Piece, colorMap, piecesData, getIndexFromFace } from './Piece'
import { Facelet } from './Facelet'
import { shuffle } from './Utils'

//

export default class Cube {
  
  /** Dimensions for the cube, default 3x3 */
  private dimensions: number = DIMENSIONS
  
  /** Size of each piece, currently 0.33 world units */
  private pieceSize: number = PIECE_SIZE

  /** Size of the whole cube in world units */
  private cubeSize: number

  /** 
   * Default is a solved cube
   * https://github.com/muodov/kociemba#cube-string-notation
   */
  private faceletString: string = SOLVED_CUBE
  
  private pieces: Array<Piece> = [ ]
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))

  findSolution: (number, string) => string

  //

  constructor(private scene: Scene) {

     this.faceletString = this.randomFaceletString()

    this.loadBackend()

    this.cubeSize = this.dimensions * this.pieceSize

    /** Offset by half of the total cube size in each axis so it's centered in the world */
    const pieceSizeOffset = (this.cubeSize / 2) - (this.pieceSize / 2)

    // TODO: We want a nice brushed steel kinda material, would need to figure out the colors tho
    // TODO: Put black gaps between the cubes like how it would be in real life?
    const material = new MeshBasicMaterial({ vertexColors: true })

    // Generate the pieces (aka cubelets) 
    for (const { indices, positions } of piecesData) {
      const facelets: Array<Facelet> = [ ]

      for (let i = 0; i < positions.length; i++) {
        facelets.push(
          new Facelet(positions[i], colorMap[ positions[i][0] ])
        )
      }

      const geometry = 
        new BoxGeometry(this.pieceSize, this.pieceSize, this.pieceSize)
        .toNonIndexed()

      geometry.setAttribute(
        'color', 
        new Float32BufferAttribute(
          this.generateFaceletColors(facelets), 
          3 
        )
      )

      const mesh = new Mesh(geometry, material)

      // Set the position for the piece based on the current index of each axis
      mesh.position.x = (indices.x * this.pieceSize) - pieceSizeOffset
      mesh.position.y = (indices.y * this.pieceSize) - pieceSizeOffset
      mesh.position.z = (indices.z * this.pieceSize) - pieceSizeOffset

      // Add each piece mesh to the scene so it renders
      // Delay each cube one by one:   setTimeout(() => , 1000 * (indices.x * 9 + indices.y * 3 + indices.z))
      this.cubeGroup.add(mesh)

      this.pieces.push(new Piece( indices, facelets, mesh ))
    }

    this.scene.add(this.cubeGroup) 
  }

  //

  /** Solve the cube using kociemba two-phase */
  solve() {

  }

  /** Scramble the cube to a random configuration */
  scramble() {
    
  }

  /** 
   * Parse a string of command codes, enqueue each command.
   * e.x. "U L R U F R' B D U'"
   * https://ruwix.com/the-rubiks-cube/notation/
   * https://ruwix.com/the-rubiks-cube/notation/advanced/
   */
  move(commandString: string) {
    const commandCodes = <Array<CommandCode>> commandString.split(' ')

    for (let commandCode of commandCodes) {
      /** Set the number of repetitions to 1 by default. Repetition amounts are single-digit */
      const repetitionsToExecute = parseInt(commandCode.slice(-1)) || 1

      // Need just the letters if repetitions is specified
      if (repetitionsToExecute > 1) {
        commandCode = <CommandCode> commandCode.slice(0, -1)
      }

      const command = getCommandByCode(
        <CommandCode> commandCode, 
        repetitionsToExecute
      )

      if (command) {
        this.commandQueue.enqueue(command)
      }
      else {
        console.warn(`${ commandCode } is an invalid command code. Refer to Commands.ts for valid command codes.`)
      }
    }
  }

  //

  /**
   * A buffer attribute of a mesh is always a flat array, so we need to 
   * generate a colors array with each RGB value in the right order.
   */
  private generateFaceletColors(facelets) {

    const faceletColorIndices = [ ]

    for (const facelet of facelets) {
      faceletColorIndices[ getIndexFromFace( facelet.position[0] ) ] = 
        facelet.hexCode
    }

    const colors = [ ]
    const color = new Color()

    for (let i = 0; i < 6; i++) {
      let colorHex

      if (faceletColorIndices[i]) {
        colorHex = faceletColorIndices[i]
      }
      else {
        colorHex = 0x000000
      }

      color.set(colorHex)

      for (let i = 0; i < 6; i++) {
        colors.push(color.r, color.g, color.b)
      }
    }

    return colors
  }

  //

  private randomFaceletString() {
    // ***** Make sure it generates only valid definitions
    const faceletString: string = shuffle( SOLVED_CUBE.split('') ).join('')
    
    console.log(faceletString)

    return faceletString
  }
  
  //

  // TODO: Reduce the filesize of solve.js generated by emscripten as much as possible. Don't need all the extra node stuff or whatever.
  private loadBackend() {
    window.Module = {
      onRuntimeInitialized: () => {
        this.findSolution = window.Module.cwrap('solve', 'string', [ 'number', 'string' ])

        console.log(this.findSolution(2, this.faceletString))

        this.move(
          this.findSolution(2, this.faceletString)
        )
      },

      locateFile: (fileName) => {
        return `${ window.location.href }backend/${ fileName }`
      }
    }

    // Run Emscripten glue code if not already run
    if (!document.querySelector('#solver')) {
      const script = document.createElement('script')
      script.src = '/backend/solve.js'
      script.async = true
      script.id = "solver"
      document.body.appendChild(script)
      // script.onload = () => { } // could return a promise
    }
  }

  /**
   * Execute the command currently at the top of the queue. Calls itself 
   * recursively until the queue is empty.
   */
  private async executeCommand(command: Command) {
    const layerGroup = new Group()

    /** Lazy loaded pieces, ensures that piece selection matches up with 3D world */ 
    const pieces = command.selector(this.cubeGroup.children)

    for (const piece of pieces) {
      layerGroup.add(piece)
    }

    this.cubeGroup.add(layerGroup)

    // TODO: pile all the commands onto a gsap timeline so we can set ease and duration for the whole thing. 

    await gsap.to(layerGroup.rotation, {
      [ command.axis ]: `
        ${ command.direction }=${ (Math.PI / 2) * command.repetitions }
      `,

      duration: 0.7 + (command.repetitions * 0.3),
      
      ease: 'back.inOut(1)'
    })

    // THREE does not retain local transforms if you remove a child from a group.
    // Save the current transforms, remove from layer group, add back transforms
    for (const piece of pieces) {
      const position = piece.getWorldPosition(new Vector3())
      const quaternion = piece.getWorldQuaternion(new Quaternion())

      this.cubeGroup.add(piece)

      piece.position.copy(position)
      piece.quaternion.copy(quaternion) 
    }

    // Get rid of layer so it doesn't count as a child of cubeGroup
    layerGroup.removeFromParent()

    // Dequeue this command so the next one can execute
    this.commandQueue.dequeue()

    // Will call itself recursively until queue is empty
    if (this.commandQueue.commands.length > 0) {
      this.executeCommand(this.commandQueue.commands[0])
    }
  }

  //


  // Then cleanup the codebase so far

  // Then add below methods, then do UI and touch/mouse controls and wrap up
  // TODO: See how the Google Doodle rubiks cube handles solving and user interaction at the same time. Should user be able to interact in the middle of solving?


}

