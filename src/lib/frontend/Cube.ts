import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from "three"

export default class Cube {
  private pieces: Array<Mesh>

  constructor(private scene: Scene) {
    this.pieces = [ ]

    
    // TODO: refer to marble-rubiks-loop project, come up with a smarter way to 
    // generate the positions for each piece. 
    // Maybe put the bottom of the cube at y=0 instead of perfectly centering it. Would make the math easier. Will need to adjust the camera

    // TODO: Also add lighting


    /** Dimensions for the cube, currently 3x3 */
    const dimensions = 3

    /** Size of each piece, currently 0.33 world units */
    const pieceSize = 1 / 3

    const geometry = new BoxGeometry(pieceSize, pieceSize, pieceSize)
    const material = new MeshBasicMaterial({ color: 0xff00ff })

    for (let i = 0; i < 27; i++) {
      this.pieces.push(
        new Mesh(geometry, material)
      )

      this.pieces[i].position.y = (Math.random() * 5) - 2.5

      this.scene.add(this.pieces[i])
    }
  }

}



