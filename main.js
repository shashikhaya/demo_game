/* eslint-disable no-var */

import { createInterface } from 'readline'
import promptSync from 'prompt-sync'
import { exit } from 'process'
const prompt = promptSync({ sigint: true })

class Room {
  constructor () {
    this.options = this.createOptions()
    this.doorOpen = false
  }

  createOptions () {
    const options = [] // empty array called options
    options.push('1. Inspect desk') // adding option 1
    options.push('2. Try door') // adding option 2
    return options
  }

  displayOptions () {
    this.refreshOptions()
    console.log(`Here are your options :\n${this.options.join('\n')}`)
  }

  refreshOptions () {
    this.options = this.createOptions()
  }

  handleInput (input) {
    if (input > this.options.length) {
      console.log('error')
    } else {
      switch (parseInt(input)) {
        case 1:
          this.inspectDesk()
          break
        case 2: this.tryDoor()
          break
      }
    }
  }

  inspectDesk () {
    global.state = 'desk'
  }

  tryDoor () {
    if (global.keyFound === true) {
      this.doorOpen = true
    } else {
      console.log('Oops, you havent unlocked the door yet. Keep trying ;)')
    }
  }
}

class Desk {
  constructor () {
    this.drawOpen = false
    this.options = this.createOptions()
  }

  createOptions () {
    const options = [] // empty array called options
    options.push(`1. ${this.drawOpen ? 'Close' : 'Open'} drawer`) // adding option 1
    options.push('2. Inspect room') // adding option 2
    return options// options ='1. \n 2. \n
  } // call refresh options when option 1 selected

  refreshOptions () {
    this.options = this.createOptions()
  }

  displayOptions () {
    this.refreshOptions()
    console.log(`Here are your options :\n${this.options.join('\n')}`)
  }

  handleInput (input) {
    if (input > this.options.length) { // check that input is valid
      console.log('Error, you cant do that! Try again')
    } else { // choose which method to call
      switch (parseInt(input)) {
        case 1:
          this.toggleDraw()
          break
        case 2: this.inspectRoom()
          break
      }
    }
  }

  toggleDraw () {
    this.drawOpen = !(this.drawOpen)
    global.keyFound = true
  }

  inspectRoom () {
    global.state = 'room'
  }
}

function main () {
  // initialise game
  global.objectDict = initialiseObjects()
  global.state = 'room'
  global.inventory = 'Empty'
  var counter = 0
  const INIT_TIME_MS = Date.now() // Could change -> maybe not necessary -> get elapsed time by subtracting date.now() at start and finish
  global.keyFound = false
  // game initialised

  // enter game loop
  do {
    console.log('')
    updateStatus()
    askQuestion()
    counter++
  } while (global.objectDict.room.doorOpen === false)

  // doorOpen set to true -> game is finsihed -> log stats
  console.log(
    `Well done, you have escaped in ${counter} moves and it took you ${getElapsedTime(INIT_TIME_MS)} minutes`)

  playAgain()
}

function playAgain() {
  console.log('')
  console.log(`Would you like to play again? 'Yes' or 'No'`)
  const ans = prompt('>  ')
  if (ans === 'Yes') {
    return main()
  } else if (ans === 'No') {
    return exit()
  } else {
    return playAgain()
  }
}

function getElapsedTime (initTime) {
  // calculate elapsed time
  const eTime = Date.now() - initTime // times in milliseconds at this point
  return (eTime / 60000).toFixed(2)
}
function updateStatus() {
  updateInventory()
  console.log(`You are now inspecting the ${global.state}`)
  console.log(`Inventory: ${global.inventory}`)
  // if global.keyfound {console.log(inventory)}
  global.objectDict[global.state].displayOptions() // displaying updated options for the currently inspected object
  
}
function updateInventory() {
  if ((global.keyFound) && !(global.inventory.includes('Key'))) { global.inventory = ['Key'] }

}

function askQuestion () {
  console.log(`What would you like to do next? Pick between 1 and ${global.objectDict[global.state].options.length}`)
  const ans = prompt('>  ')
  global.objectDict[global.state].handleInput(ans)
}

function initialiseObjects () {
  const objects = {}
  objects.room = new Room()
  objects.desk = new Desk()
  return objects
}

main()
