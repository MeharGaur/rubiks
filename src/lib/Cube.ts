import { BoxGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, Scene, Vector3 } from 'three'
import { gsap } from 'gsap'

import { getCommandByCode } from './Commands'
import { Tempos } from './Types'
import type { Command, CommandCode } from './Types'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE, SOLVED_CUBE, Z_FIGHT_INCREMENT } from './Config'
import { Piece, colorMap, piecesData } from './Piece'
import { Facelet } from './Facelet'

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
  private faceString: string = SOLVED_CUBE

  private pieces: Array<Piece> = [ ]
  private facelets: Array<Facelet> = [ ]
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))
  
  findSolution: (faceString: string, destinationString?: string) => string
  randomCube: () => string
  loading: boolean = true
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
    for (const { indices, faceletPositions } of piecesData) {
      const facelets: Array<Facelet> = [ ]

      const pieceMesh = new Mesh(pieceGeometry, pieceMaterial)

      // Generate the facelets (aka stickers)
      for (let i = 0; i < faceletPositions.length; i++) {
        // TODO: pass down as a uniform or something instead of new material for every one
        const faceletMaterial = new MeshBasicMaterial({ color: 0xff00ff, side: DoubleSide })
        const faceletMesh = new Mesh(faceletGeometry, faceletMaterial)

        this.cubeGroup.add(faceletMesh)

        const facelet = new Facelet(
          pieceMesh,
          faceletPositions[i], 
          faceletMesh
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
    
    // Properly position each facelet around the cube
    for (const facelet of this.facelets) {
      
      const face = facelet.position[0]
      
      // Offset by half piece size, add Z_FIGHT increment to prevent z-fighting
      const increment = (this.pieceSize / 2) + Z_FIGHT_INCREMENT

      // @ts-ignore
      facelet.mesh.material.color.set( colorMap[face] )
      
      facelet.mesh.position.copy(facelet.pieceMesh.position)

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
    }

    this.scene.add(this.cubeGroup) 
  }

  //

  /** Scramble the cube to a random configuration */
  scramble() {
    const randomFaceString = this.randomCube()

    const commandString = this.findSolution(
      this.faceString, 
      randomFaceString
    ) 

    this.tempo = Tempos.Scramble

    this.move(commandString)

    this.faceString = randomFaceString
  }

  /** Solve the cube using kociemba two-phase */
  solve() {
    if (this.faceString == SOLVED_CUBE) {
      return alert('The cube is already solved– try scrambling it!')
    }

    const commandString = this.findSolution(this.faceString)

    this.tempo = Tempos.Normal

    this.move(
      commandString  
    )

    this.faceString = SOLVED_CUBE
  }

  /** 
   * Parse a string of command codes, enqueue each command.
   * e.x. "U L R U F R' B D U'"
   * https://ruwix.com/the-rubiks-cube/notation/
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

  // TODO: Reduce the filesize of backend/index.js generated by emscripten as much as possible. Don't need all the extra node stuff or whatever.
  private loadBackend() {
    window.Module = {
      onRuntimeInitialized: () => {
        this.findSolution = window.Module.cwrap('findSolution', 'string', [ 'string', 'string' ])
        this.randomCube = window.Module.cwrap('randomCube', 'string', [  ])
        
        // TODO: expose a promise for on load
        this.loading = false
      },

      locateFile: (fileName) => {
        return `${ window.location.href }backend/${ fileName }`
      }
    }

    // Run Emscripten glue code if not already run
    if (!document.querySelector('#solver')) {
      const script = document.createElement('script')
      script.src = '/backend/index.js'
      script.async = true
      script.id = "solver"
      document.body.appendChild(script)
    }
  }
  
  //

  /**
   * Execute the command currently at the top of the queue. Calls itself 
   * recursively until the queue is empty.
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
      }
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

  private calculateTweenVars(repetitions: number) {

    if (this.tempo == Tempos.Normal) {
      return {
        duration: 0.4 + (repetitions * 0.3),
        ease: 'back.inOut(1.15)'
      }
    }
    
    else if (this.tempo == Tempos.Scramble) {
      return {
        // duration: 0.3 + ((repetitions - 1) * 0.25),
        duration: 0.25 + ((repetitions - 1) * 0.2),
        ease: 'Power1.inOut(2)'
      }
    }
  }

  //

}

