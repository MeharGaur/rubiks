import { BoxGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, Scene, Vector3 } from 'three'
import { gsap } from 'gsap'

import { getCommandByCode } from './Commands'
import { ALL_COMMAND_CODES, ALL_FACELET_POSITIONS, ALL_FACES, Colors } from './Types'
import type { Command, CommandCode, Face } from './Types'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE, SOLVED_CUBE, Z_FIGHT_INCREMENT } from './Config'
import { Piece, colorMap, piecesData } from './Piece'
import { Facelet } from './Facelet'
import { epsilonEquals, roundEquals, shuffle } from './Utils'

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
  private faceString: string = SOLVED_CUBE //  'DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD' // 
  
  private pieces: Array<Piece> = [ ]
  private facelets: Array<Facelet> = [ ]
  private faceletLookup: { [key: string]: Vector3 } = { }
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))
  
  findSolution: (number, string) => string
  randomCube: () => string
  tempo: number = Tempos.Normal

  //

  constructor(private scene: Scene) {

    this.loadBackend()

    this.cubeSize = this.dimensions * this.pieceSize

    /** Offset by half of the total cube size in each axis so it's centered in the world */
    const pieceSizeOffset = (this.cubeSize / 2) - (this.pieceSize / 2)

    // TODO: We want a nice brushed steel kinda material, would need to figure out the colors tho
    // TODO: Put black gaps between the cubes like how it would be in real life?
    const pieceMaterial = new MeshBasicMaterial({ color: 0x000000 })
    const pieceGeometry = new BoxGeometry(this.pieceSize, this.pieceSize, this.pieceSize)

    const faceletGeometry = new PlaneGeometry(this.pieceSize, this.pieceSize)

    // Generate the pieces (aka cubelets) 
    for (const { indices, positions } of piecesData) {
      const facelets: Array<Facelet> = [ ]

      const pieceMesh = new Mesh(pieceGeometry, pieceMaterial)

      for (let i = 0; i < positions.length; i++) {
        // TODO: pass down as a uniform or something instead of new material for every one
        const faceletMaterial = new MeshBasicMaterial({ color: 0xff00ff, side: DoubleSide })
        const faceletMesh = new Mesh(faceletGeometry, faceletMaterial)

        this.cubeGroup.add(faceletMesh)

        const facelet = new Facelet(
          pieceMesh,
          positions[i], 
          faceletMesh,
          colorMap[ positions[i][0] ]
        )

        facelets.push(facelet)
        this.facelets.push(facelet)
      }

      // Set the position for the piece based on the current index of each axis
      pieceMesh.position.x = (indices.x * this.pieceSize) - pieceSizeOffset
      pieceMesh.position.y = (indices.y * this.pieceSize) - pieceSizeOffset
      pieceMesh.position.z = (indices.z * this.pieceSize) - pieceSizeOffset

      // Add each piece mesh to the scene so it renders
      // Delay each cube one by one:   setTimeout(() => , 1000 * (indices.x * 9 + indices.y * 3 + indices.z))
      this.cubeGroup.add(pieceMesh)

      this.pieces.push(new Piece(
        indices, facelets, pieceMesh, this.pieceSize, pieceSizeOffset
      ))
    }

    // Get it into the U1 U2 U3 etc. order
    this.facelets.sort((a, b) => {
      const aFace = ALL_FACES.indexOf(<Face> a.position[0])
      const bFace = ALL_FACES.indexOf(<Face> b.position[0])

      if (aFace == bFace) {
        return parseInt(a.position[1]) - parseInt(b.position[1])
      }

      return aFace - bFace
    })
    
    for (const facelet of this.facelets) {
      facelet.mesh.position.copy(facelet.pieceMesh.position)

      const face = facelet.position[0]
      // Prevent z-fighting glitchyness
      const increment = (this.pieceSize / 2) + Z_FIGHT_INCREMENT

      facelet.mesh.material.color.set( colorMap[face] )

      if (face == 'U') {
        facelet.mesh.rotation.x = Math.PI / 2
        facelet.mesh.position.y +=  increment
      }

      else if (face == 'R') {
        facelet.mesh.rotation.y = Math.PI / 2
        facelet.mesh.position.x += increment
      }

      else if (face == 'F') {
        facelet.mesh.position.z += increment
      }

      else if (face == 'D') {
        facelet.mesh.rotation.x = Math.PI / 2
        facelet.mesh.position.y -= increment
      }

      else if (face == 'L') {
        facelet.mesh.rotation.y = Math.PI / 2
        facelet.mesh.position.x -= increment
      }

      else if (face == 'B') {
        facelet.mesh.position.z -= increment
      }

      this.faceletLookup[facelet.position] = 
        facelet.mesh.getWorldPosition(new Vector3())
    }

    this.scene.add(this.cubeGroup) 
  }

  //

  /** Scramble the cube to a random configuration */
  scramble() {
    const randomFaceString = this.randomCube()
    
    console.log(randomFaceString)

    this.tempo = Tempos.Scramble

    // this.move(randomCommands)
  }

  /** Solve the cube using kociemba two-phase */
  solve() {
    // this.updateFaceString()

    this.tempo = Tempos.Normal

    this.move(
      `U U' U' U`
      // this.findSolution(2, this.faceString)
    )
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

  private onLoad() {
    // this.scramble()
  }

  // TODO: Reduce the filesize of solve.js generated by emscripten as much as possible. Don't need all the extra node stuff or whatever.
  private loadBackend() {
    window.Module = {
      onRuntimeInitialized: () => {
        this.findSolution = window.Module.cwrap('solve', 'string', [ 'number', 'string' ])
        this.randomCube = window.Module.cwrap('randomCube', 'string', [  ])

        this.onLoad()
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

  //

  private randomCommandString() {
    // ***** Make sure it generates only valid definitions
    return shuffle([ ...ALL_COMMAND_CODES,  ...ALL_COMMAND_CODES ]).join(' ')
  }

  //

  private updateFaceString() {

  }
  
  //

  /**
   * Execute the command currently at the top of the queue. Calls itself 
   * recursively until the queue is empty.
   * 
   * TODO: Cubes are not updating in time only in middle layer selection
   */
  private async executeCommand(command: Command) {

    const layerGroup = new Group()

    const selectedPieces = command.selector(this.pieces)

    for (const piece of selectedPieces) {
      layerGroup.add(piece.mesh)

      for (const facelet of piece.facelets) {
        layerGroup.add(facelet.mesh)
      }
    }

    this.cubeGroup.add(layerGroup)

    // TODO: pile all the commands onto a gsap timeline so we can set ease and duration for the whole thing. 

    await gsap.to(layerGroup.rotation, {
      [ command.axis ]: `
        ${ command.direction }=${ (Math.PI / 2) * command.repetitions }
      `,

      ...this.calculateTweenVars(command.repetitions)
    })

    // THREE does not retain local transforms if you remove a child from a group.
    // Save the current transforms, remove from layer group, add back transforms
    for (const piece of selectedPieces) {
      const position = piece.mesh.getWorldPosition(new Vector3())
      const quaternion = piece.mesh.getWorldQuaternion(new Quaternion())

      this.cubeGroup.add(piece.mesh)

      piece.mesh.position.copy(position)
      piece.mesh.quaternion.copy(quaternion)

      for (const facelet of piece.facelets) {
        const position = facelet.mesh.getWorldPosition(new Vector3())
        const quaternion = facelet.mesh.getWorldQuaternion(new Quaternion())
  
        this.cubeGroup.add(facelet.mesh)
  
        facelet.mesh.position.copy(position)
        facelet.mesh.quaternion.copy(quaternion) 
  
        const faceletPosition = Object.keys(this.faceletLookup)
          .find((key) => {
            return epsilonEquals(this.faceletLookup[key], facelet.mesh.position) 
          })
  
        console.log(facelet.position, faceletPosition)
      }
    }

    console.log(
      this.facelets
        .map(facelet => facelet.position[0])
        .join('')
    )

    // Get rid of layer so it doesn't count as a child of cubeGroup
    layerGroup.removeFromParent()

    // Dequeue this command so the next one can execute
    this.commandQueue.dequeue()

    // Will call itself recursively until queue is empty
    if (this.commandQueue.commands.length > 0) {
      this.executeCommand(this.commandQueue.commands[0])
    }
  }

  private calculateTweenVars(repetitions: number) {
    if (this.tempo == Tempos.Normal) {
      return {
        duration: 0.7 + (repetitions * 0.3),
        ease: 'back.inOut(1)'
      }
    }
    else if (this.tempo == Tempos.Scramble) {
      return {
        duration: 0.15,
        ease: 'Power1.inOut'
      }
    }
  }

  //

}


enum Tempos {
  Normal = 1,

  Scramble = 2
}

