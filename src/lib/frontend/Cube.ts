import { BoxGeometry, Color, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, Quaternion, Scene, Vector3 } from 'three'
import { gsap } from 'gsap'

import { getCommandByCode } from './Commands'
import { ALL_FACELET_POSITIONS } from './Types'
import type { Command, CommandCode } from './Types'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE } from './Config'
import Piece from './Piece'
import { colorMap, piecesData } from './CubeDefinition'

//

export default class Cube {
  
  private dimensions: number = DIMENSIONS
  private pieceSize: number = PIECE_SIZE
  private cubeSize: number
  private pieces: Array<Piece> = [ ]
  private cubeDefinition: string = 'DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD'
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))

  constructor(private scene: Scene) {
    // this.generateGeometries()

    this.cubeSize = this.dimensions * this.pieceSize

    /** Offset by half of the total cube size in each axis so it's centered in the world */
    const pieceSizeOffset = (this.cubeSize / 2) - (this.pieceSize / 2)

    const colorFaceletMap = { }
    
    for (let i = 0; i < ALL_FACELET_POSITIONS.length; i++) {
      colorFaceletMap[ ALL_FACELET_POSITIONS[i] ] = colorMap[ this.cubeDefinition[i] ]
    }

    // TODO: We want a nice brushed steel kinda material, would need to figure out the colors tho
    // TODO: Put black gaps between the cubes like how it would be in real life?
    const material = new MeshBasicMaterial({ vertexColors: true })

    // Generate the pieces (aka cubelets) 
    // TODO: Generate based on color, not just xyz index
    // https://github.com/muodov/kociemba#cube-string-notation
    for (const { isCore, indices, faceletPositions } of piecesData) {
      const facelets = [ ]

      for (let i = 0; i < faceletPositions.length; i++) {
        facelets.push({
          position: faceletPositions[i],
          ...colorFaceletMap[ faceletPositions[i] ]
        })
      }

      const geometry = 
        new BoxGeometry(this.pieceSize, this.pieceSize, this.pieceSize)
        .toNonIndexed()

      const colors = [ ]
      const color = new Color()

      const facesOrder = [ ]

      for (const facelet of facelets) {
        const face = facelet.position[0]
        let index
        
        // Right face is index 0
        if (face == 'R') {
          index = 0
        }
        // Left face is index 1
        else if (face == 'L') {
          index = 1
        }
        // Up face is index 2
        else if (face == 'U') {
          index = 2
        }
        // Down face is index 3
        else if (face == 'D') {
          index = 3
        }
        // Front face is index 4
        else if (face == 'F') {
          index = 4
        }
        // Back face is index 5
        else if (face == 'B') {
          index = 5
        }

        facesOrder[index] = facelet.colorHex
      }

      for (let i = 0; i < 6; i++) {
        let colorHex

        if (facesOrder[i]) {
          colorHex = facesOrder[i]
        }
        else {
          colorHex = 0x000000
        }

        color.set(colorHex)

        for (let i = 0; i < 6; i++) {
          colors.push(color.r, color.g, color.b)
        }
      }

      geometry.setAttribute('color', new Float32BufferAttribute( colors, 3 ))

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
  

  /** 
   * Parse a string of command codes, enqueue each command.
   * e.x. "U L R U F R' B D U'"
   * https://ruwix.com/the-rubiks-cube/notation/
   * https://ruwix.com/the-rubiks-cube/notation/advanced/
   */
  parseCommandCodes(commandCodeString: string) {
    const commandCodes = <Array<CommandCode>> commandCodeString.split(' ')

    for (let commandCode of commandCodes) {
      /**
       * Set the number of repetitions to 1 by default. 
       * Backend only sends single-digit repetition amounts.
       */
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

  scramble() {
    this.cubeDefinition = 'DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD'  
  }

}

