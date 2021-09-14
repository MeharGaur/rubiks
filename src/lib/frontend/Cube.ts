import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Quaternion, Scene, Vector3 } from 'three'
import { gsap } from 'gsap'

import { getCommandByCode } from './Commands'
import type { Command, CommandCode } from './Types'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE } from './Config'
import Piece from './Piece'

//

export default class Cube {
  
  private dimensions: number = DIMENSIONS
  private pieceSize: number = PIECE_SIZE
  private cubeSize: number
  private pieces: Array<Piece> = [ ]
  private cubeDefinition: string
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))

  constructor(private scene: Scene) {

    this.scramble()

    this.cubeSize = this.dimensions * this.pieceSize

    const geometry = new BoxGeometry(this.pieceSize, this.pieceSize, this.pieceSize)

    // TODO: We want a nice brushed steel kinda material, would need to figure out the colors tho
    // TODO: Put black gaps between the cubes like how it would be in real life?
    const lightMaterial = new MeshBasicMaterial({ color: 0xDFDFC3 })
    const darkMaterial = new MeshBasicMaterial({ color: 0x292929 })

    /** Offset by half of the total cube size in each axis so it's centered in the world */
    const pieceSizeOffset = (this.cubeSize / 2) - (this.pieceSize / 2)

    // Generate the pieces (aka cubelets) 
    // TODO: Generate based on color, not just xyz index
    // https://github.com/muodov/kociemba#cube-string-notation

    for (let x = 0; x < this.dimensions; x++) {

      for (let y = 0; y < this.dimensions; y++) {
        
        for (let z = 0; z < this.dimensions; z++) {
          const pieceIndex = (x * 9) + (y * 3) + (z)

          // 

          setTimeout(() => {
            const piece = new Piece(
              'U', 
              new Vector3(x, y, z), 
              new Mesh(
                geometry,
                ((x + y + z) % 2 == 0) ? lightMaterial : darkMaterial
              )
            )
            
            this.pieces[pieceIndex] = piece
            
            // Set the position for the piece based on the current index of each axis
            piece.mesh.position.x = (x * this.pieceSize) - pieceSizeOffset
            piece.mesh.position.y = (y * this.pieceSize) - pieceSizeOffset
            piece.mesh.position.z = (z * this.pieceSize) - pieceSizeOffset
            
            // Add each piece to the scene
            this.cubeGroup.add(this.pieces[pieceIndex].mesh)
          }, pieceIndex * 1000)
        }
      }
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

