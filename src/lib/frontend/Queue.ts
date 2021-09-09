import type { Command } from './Commands'

// If cube is currently animating don't add user actions to queue // TODO: figure out user controls

/**
 * As long as there are commands in queue, the cube will continue to animate.
 */
export default class Queue {
  commands: Array<Command> = [ ]
  
  constructor(private startExecution: Function) { }

  /** Add a command to the back of the queue */
  enqueue(command: Command) {
    this.commands.push(command)

    // Start execution again if it was empty before
    if (this.commands.length == 1) {
      this.startExecution(this.commands[0])
    }
  }

  /** Remove the command at the front of the queue */
  dequeue() {
    this.commands = this.commands.slice(1)
  }
}

