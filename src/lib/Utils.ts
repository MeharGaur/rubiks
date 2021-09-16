import type { Vector3 } from "three";

/** 
 * Knuth unbiased shuffle
 * https://bost.ocks.org/mike/shuffle/
 * http://sedition.com/perl/javascript-fy.html
 */
export function shuffle(array: Array<any>): Array<any> {
  let currentIndex: number = array.length
  let randomIndex: number

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [
      array[currentIndex], 
      array[randomIndex]
    ] = [
      array[randomIndex], 
      array[currentIndex]
    ]
  }

  return array
}

//

/** https://discourse.threejs.org/t/comparing-two-vectors/12106/2 */
export function epsilonEquals(
  a: Vector3, 
  b: Vector3, 
  epsilon = Number.EPSILON
) {
  
  // console.log(a, b)

  // console.log(Math.abs( a.x - b.x ), Math.abs( a.y - b.y ), Math.abs( a.z - b.z ))

  return (
    ( Math.abs( a.x - b.x ) < epsilon ) && 
    ( Math.abs( a.y - b.y ) < epsilon ) && 
    ( Math.abs( a.z - b.z ) < epsilon )
  )
}


export function roundEquals(a: Vector3, b: Vector3) {  
  return (
    ( Math.round(a.x) == Math.round(b.x) ) &&
    ( Math.round(a.y) == Math.round(b.y) ) &&
    ( Math.round(a.z) == Math.round(b.z) ) 
  )
}

