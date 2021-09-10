import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Quaternion, Scene, Vector3 } from 'three'

import { gsap } from 'gsap'
import { getCommandByCode } from './Commands'
import type { Command, CommandCode } from './Commands'
import Queue from './Queue'
import { DIMENSIONS, PIECE_SIZE } from './Parameters'

//

export default class Cube {
  
  private dimensions: number = DIMENSIONS
  private pieceSize: number = PIECE_SIZE
  private cubeSize: number
  private matrix: Array<[ ]> | Array<Mesh> = [ ]
  private cubeGroup: Group = new Group()
  private commandQueue: Queue = new Queue(this.executeCommand.bind(this))

  constructor(private scene: Scene) {

    this.cubeSize = this.dimensions * this.pieceSize

    const geometry = new BoxGeometry(this.pieceSize, this.pieceSize, this.pieceSize)

    // TODO: We want a nice brushed steel kinda material, would need to figure out the colors tho
    // TODO: Put black gaps between the cubes like how it would be in real life?
    const pinkMaterial = new MeshBasicMaterial({ color: 0xff00ff })
    const aquaMaterial = new MeshBasicMaterial({ color: 0x00ffff })

    /** Offset by half of the total cube size in each axis so it's centered in the world */
    const pieceSizeOffset = (this.cubeSize / 2) - (this.pieceSize / 2)

    // Generate the cube matrix
    for (let x = 0; x < this.dimensions; x++) {
      this.matrix[x] = [ ]

      for (let y = 0; y < this.dimensions; y++) {
        this.matrix[x][y] = [ ]
        
        for (let z = 0; z < this.dimensions; z++) {
          this.matrix[x][y][z] = new Mesh(
            geometry, 
            (Math.random() > 0.5) ? pinkMaterial : aquaMaterial // Pink/aqua materials just for testing
          )
          
          // Set the position for the piece based on the current index of each axis
          this.matrix[x][y][z].position.x = (x * this.pieceSize) - pieceSizeOffset
          this.matrix[x][y][z].position.y = (y * this.pieceSize) - pieceSizeOffset
          this.matrix[x][y][z].position.z = (z * this.pieceSize) - pieceSizeOffset
          
          // Add each piece to the scene
          this.cubeGroup.add(this.matrix[x][y][z])
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

    for (const commandCode of commandCodes) {
      const command = getCommandByCode(commandCode)

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

    await gsap.to(layerGroup.rotation, {
      // TODO: There might be double turns, like '2U' or '2F'. 
      // Turn it by a full PI to do double turn
      // ***** Even better, toss it into the queue but have the queue automatically coalesce back-to-back same commands into one command
      [ command.axis ]: `${ command.direction }=${ Math.PI / 2 }`,

      duration: 0.95,
      
      // TODO: make a custom ease– need a less bounce at the start and more at the end. Right now 1.8 at both ends.
      ease: 'back.inOut(1.8)'
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

}

