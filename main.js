/* eslint-disable no-var */

import { read } from 'fs'
import { rawListeners } from 'npm'
import { createInterface } from 'readline'

import promptSync from 'prompt-sync';
const prompt = promptSync({sigint: true});


class Room {
  constructor () {
    this.options = this.createOptions()
    this.doorOpen = false
  }

  createOptions () {
    const options = [] // empty array called options
    options.push('1. inspect desk') // adding option 1
    options.push('2. try door') // adding option 2
    // options == ['1','2']
    return options// options ='1. \n 2. \n
  }

  displayOptions () {
    this.refreshOptions()
    console.log(this.options.join('\n'))
  }

  refreshOptions () {
    this.createOptions()
  }

  handleInput (input) {
    if (input > this.options.length) {
      console.log('error')
    } else {
      switch (input) {
        case 1:
          this.inspectDesk()
          break
        case 2: this.tryDoor()
          break
      }
    }
  }

  inspectDesk () {
    state = 'desk'
  }

  tryDoor () {
    if (this.keyFound === true) {
      doorOpen = true
    } else {
      console.log('door cannot be opened')
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
    options.push(`1. ${(this.drawOpen) ? 'close' : 'open'}`) // adding option 1
    options.push('2. inspect room') // adding option 2
    return options// options ='1. \n 2. \n
  } // call refresh options when option 1 selected

  refreshOptions () {
    this.createOptions()
  }

  displayOptions () {
    this.refreshOptions()
    console.log(this.options.join('\n'))
  }

  handleInput (input) {
    if (input > this.options.length) { // check that input is valid
      console.log('error')
    } else { // choose which method to call
      switch (input) {
        case 1:
          this.toggleDraw()
          break
        case 2: this.inspectRoom()
          break
      }
    }
  }

  toggleDraw (state) {
    this.drawOpen = (!(this.drawOpen))
    keyFound = true
  }

  inspectRoom (state) {
    state = 'room'
  }
}

function main () {
  // initialise game
  var objectDict = initialiseObjects()
  var state = 'room'
  var counter = 0
  const INIT_TIME_MS = Date.now() // Could change -> maybe not necessary -> get elapsed time by subtracting date.now() at start and finish
  var keyFound = false
  // game initialised

  // enter game loop
  do {
    objectDict[state].displayOptions() // displaying updated options for the currently inspected object
    askQuestion(objectDict, state)
    // readline.question(`What would you like to do? pick between 1 and ${objectDict[state].options.length}` (ans) => {
    //   // objectDict[state].handleInput(ans)
    //   console.log(ans)
    //   readline.close()
    // })
    // counter++
  } while (objectDict.room.doorOpen === false)

  // doorOpen set to true -> game is finsihed -> log stats
  console.log(
    ` Well done, you have escaped in ${counter} moves and it took you ${getElapsedTime(INIT_TIME_MS)} minutes`)
}

function getElapsedTime (initTime) {
  // calculate elapsed time
  const eTime = Date.now() - initTime // times in milliseconds at this point
  return (eTime / 60000).toFixed(2)
}

function askQuestion (objects_dict,state) {
  let ans = prompt(`What would you like to do? pick between 1 and ${objects_dict[state].options.length}`)
  objects_dict[state].handleInput(ans)
  console.log(ans)
}

function initialiseObjects () {
  const objects = {}
  objects.room = new Room()
  objects.desk = new Desk()
  return objects
}

main()
