// imports
import * as main from './main.js'
import { exit } from 'process'
import chalk from 'chalk'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })

/* General class structure:
1. properties:
a. options [array] (holds the move options for that object e.g. desk -> open/close door)
2. methods
a. handleInputs() -> handle the user input by either calling an object specific method or changing the game state global.state
i. object specific methods
ii. inspectX -> changes the game state
b. create options, refresh options and display options -> options are dynamic so they change with respect to the game status e.g. if drawer open, option become close drawer etc

*/

export class Game {
  constructor() {    
    this.startMenu = new StartMenu() // create startMenu Object -> has the rules and handles the user input for the start loop
    this.main()
  }

  // main function
  main () {
  this.startMenu.startMenuLoop() // start loop -> should probably be in the startMenu object
  // enter game loop
  this.gameLoop() // game loop repeats until user has either quit or won
  this.playAgain() // gives user option to quit or play again -> repeats until correct input has been provided
}

  initialiseGameParameters () {
    this.keyLocations = 2 // number of possible locations for the key
    this.KEY_LOCATION = (Math.floor(Math.random() * Math.floor(this.keyLocations) + 1)) // used to randomise where the key is (either in the safe or in the desk-drawer)
    this.objectDict = this.initialiseObjects() // global dictionary with all object instances in it (the game applies different keys to transverse through states)
    this.state = 'room' // initial state (in the room)
    this.assignObjectDicts()
    this.inventory = 'Empty' // inventory starts empty (currently it can only have a key in it, but should add more objects as game develops)
    // move inventory to person class
    this.moveCount = 0
    this.INIT_TIME_MS = Date.now() // time gameplay started (used to calculate the elapsed time when the user has escaped)
    this.keyFound = false // changes whether the door can be unlocked (proper composition would remove these globals)
    this.safeUnlocked = false // changes whether the safe can be unlocked (isnt actually being used!!??)
    
  }

  assignObjectDicts () {
    Object.assign(this.objectDict.room, this)
    Object.assign(this.objectDict.desk, this)
    Object.assign(this.objectDict.wallPic, this)
    Object.assign(this.objectDict.safe, this)
    Object.assign(this.objectDict.window, this)
  }

  gameLoop () { 
    
    this.initialiseGameParameters()
    // game mechanics
    console.log( 
  `##################################################### GAME STARTED #####################################################`)
    do {
      this.updateState()
      console.log(this.objectDict.room.state)
      console.log(this.state)
      this.updateStatus() // tell user what move they are on, where they are and what they have in the inventory
      this.askQuestion() // asks for next move and handles answer
      this.moveCount++ 
    } while (!this.objectDict.room.doorOpen) // stopping condition (room is open)
      //need to try and eliminate objectDict, need the game to "have" a room
    // if game complete print this
    console.log(
      `Well done, you have escaped in ${this.moveCount} moves and it took you ${getElapsedTime(this.INIT_TIME_MS)[0]} minutes and ${getElapsedTime(this.INIT_TIME_MS)[1]} seconds.`)
  }
  
  playAgain () { // if user wants to play again -> recall main function else exit. if input is invalid then call playAgain (recursive fn)
    console.log('')
    console.log('Would you like to play again? \'Yes\' or \'No\'')
    const ans = prompt('>  ')
    if (ans.toLowerCase() === 'yes') {
      return main.main()
    } else if (ans.toLowerCase() === 'no') {
      return exit()
    } else {
      return this.playAgain()
    }
  }
  
  getElapsedTime (initTime) {
    // calculate elapsed time
    const eTime = Date.now() - initTime // times in milliseconds at this point
    const timeInMins = (eTime / 60000) // time in minutes
    const minutes = Math.floor(timeInMins)
    const seconds = Math.round((timeInMins - minutes) * 60)
    return [minutes, seconds]
  }
  
  updateStatus () { // let user know their status after each move
    this.updateInventory()
    console.log(`
  ##################################################### Move Number ${this.moveCount + 1} ####################################################
   
  You are now inspecting the ${this.state} 
   Inventory: ${this.inventory.includes('Key') ? chalk.yellow.bold(this.inventory) : this.inventory}  
  `)
    // if global.keyfound {console.log(inventory)}
    this.objectDict[this.state].displayOptions() // displaying updated options for the currently inspected object
  }
  
  updateInventory () { // if uswer has key update the inventory
    if ((this.keyFound) && !(this.inventory.includes('Key'))) { this.inventory = ['Key'] } 
  }

  updateState () {
    this.state = this.objectDict[this.state].state
  }
  
  askQuestion () { // let user progress through game  (this.objectDict[this.state] makes sure the right options and handling of answer happens)
    console.log(`
  What would you like to do next? Pick between 1 and ${this.objectDict[this.state].options.length}`) // question
    const ans = prompt('>  ') // answer
    this.objectDict[this.state].handleInput(ans) // handle answer
  }
  
  initialiseObjects () { // create dictionary with objects in game -> composition would remove the need for this?
    const objects = {} // keys = location : values = objects (e.g room:Room())
    objects.room = new Room()
    objects.desk = new Desk()
    objects.wallPic = new WallPic()
    objects.safe = new WallSafe()
    objects.window = new Window()
    return objects
  }

}


export class Room {
  constructor () {
    this.options = this.createOptions()
    this.doorOpen = false // global stopping condition (when this is set to true -> door is open, thus the user has escaped)
    
  }

  createOptions () {
    const options = [] // empty array called options
    options.push('1. Inspect desk') 
    options.push('2. Inspect picture on the wall')
    options.push('3. Inspect Window')
    options.push('4. Try door') // adding option 2
    options.push('5. Give up')
    return options
  }

  displayOptions () { // make options a string and display it
    this.refreshOptions()
    console.log(`Here are your options :\n${this.options.join('\n')}`)
  }

  refreshOptions () { // this doesnt really do anything -> not necessary
    this.options = this.createOptions()
  }

  handleInput (input) { // handle inputs, if it is not valid log error and ask again
    switch (parseInt(input)) {
      case 1:this.inspectDesk()
        break
      case 2:this.inspectWallPic()
        break
      case 3:this.inspectWindow()
        break
      case 4:this.tryDoor()
        break
      case 5:
        return exit() // quit game
      default: console.log('Error, you cant do that! Try again')
        break
    }
  }

  inspectWallPic () { 
    this.state = 'wallPic'
    this.objectDict[this.state].displayPicture() // displays picture, composition would make this alot better as the room has a wall picture
  }

  inspectDesk () { // change this state -> should be made a general function ?
    this.state = 'desk'
  }

  inspectWindow () { // change this state -> should be made a general function ?
    this.state = 'window'
  }

  tryDoor () { // if keyFound then open, otherwise dont allow it
    if (this.keyFound) {
      this.doorOpen = true
    } else {
      console.log('Oops, you havent unlocked the door yet. Keep trying ;)')
    }
  }
}

export class Desk {
  constructor () {
    this.drawOpen = false
    this.options = this.createOptions()
    if (this.KEY_LOCATION === 1) {
      this.hasKey = true
    } else {
      this.hasKey = false
    }
  }

  createOptions () {
    const options = [] // empty array called options
    options.push(`1. ${this.drawOpen ? 'Close' : 'Open'} drawer`) // adding option 1
    options.push('2. Inspect picture on the desk')
    options.push('3. Inspect room') // adding option 2
    options.push('4. Give up')

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
    switch (parseInt(input)) {
      case 1:
        this.toggleDraw()
        break

      case 2:
        this.inspectPicture()
        break

      case 3: this.inspectRoom()
        break

      case 4:
        return exit()

      default: console.log('Error, you cant do that! Try again')
        break
    }
  }

  toggleDraw () {
    this.drawOpen = !(this.drawOpen)
    if (this.hasKey) {
      this.keyFound = true
    }
  }

  inspectPicture () {
    const pw = this.objectDict.safe.password
    console.log(

  `───────▓▓▓▓▓▓▓────────────▒▒▒▒▒▒
  ──────▓▓▒▒▒▒▒▒▒▓▓────────▒▒░░░░░░▒▒
  ────▓▓▒▒▒▒▒▒▒▒▒▒▒▓▓────▒▒░░░░░░░░░▒▒▒
  ───▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒░░░░░░░░░░░░░░▒
  ──▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░▒
  ──▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░▒
  ─▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░▒
  ▓▓▒▒▒▒▒▒░░░░░░░░░░░▒▒░░▒▒▒▒▒▒▒▒▒▒▒░░░░░░▒
  ▓▓▒▒▒▒▒▒▀▀▀▀▀███▄▄▒▒▒░░░▄▄▄██▀▀▀▀▀░░░░░░▒
  ▓▓▒▒▒▒▒▒▒▄▀████▀███▄▒░▄████▀████▄░░░░░░░▒
  ▓▓▒▒▒▒▒▒█──▀█████▀─▌▒░▐──▀█████▀─█░░░░░░▒
  ▓▓▒▒▒▒▒▒▒▀▄▄▄▄▄▄▄▄▀▒▒░░▀▄▄▄▄▄▄▄▄▀░░░░░░░▒
  ─▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░▒
  ──▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░▒
  ───▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▀▀░░░░${pw}░░░░░░▒
  ────▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░▒▒
  ─────▓▓▒▒▒▒▒▒▒▒▒▒▄▄▄▄▄▄▄▄▄░░░░░░░░▒▒
  ──────▓▓▒▒▒▒▒▒▒▄▀▀▀▀▀▀▀▀▀▀▀▄░░░░░▒▒
  ───────▓▓▒▒▒▒▒▀▒▒▒▒▒▒░░░░░░░▀░░░▒▒
  ────────▓▓▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒
  ──────────▓▓▒▒▒▒▒▒▒▒▒░░░░░░░░▒▒
  ───────────▓▓▒▒▒▒▒▒▒▒░░░░░░░▒▒
  ─────────────▓▓▒▒▒▒▒▒░░░░░▒▒
  ───────────────▓▓▒▒▒▒░░░░▒▒
  ────────────────▓▓▒▒▒░░░▒▒
  ──────────────────▓▓▒░▒▒
  ───────────────────▓▒░▒
  ────────────────────▓▒
  `)
  }

  inspectRoom () {
    this.state = 'room'
  }
}

export class StartMenu {
  constructor () {
    this.options = this.createOptions()
    this.gameStarted = false
    this.displayWelcomeMessage() // display welcome message

  }

  startMenuLoop () { // user can either display rules, start game or quit
    do {
      this.displayOptions()
      console.log(`What would you like to do next? Pick between 1 and ${this.options.length}`) // question
      const ans = prompt('>  ') // answer
      this.handleInput(ans) // handle answer
    } while (!this.gameStarted) // repeat until game started or user quits
  }

  displayWelcomeMessage () { // first thing shown when main function called
    console.log(
      `
        sSSs    sSSs    sSSs   .S_SSSs     .S_sSSs      sSSs         .S_sSSs      sSSs_sSSs      sSSs_sSSs     .S_SsS_S.   
      d%%SP   d%%SP   d%%SP  .SS~SSSSS   .SS~YS%%b    d%%SP        .SS~YS%%b    d%%SP~YS%%b    d%%SP~YS%%b   .SS~S*S~SS.  
     d%S'    d%S'    d%S'    S%S   SSSS  S%S    S%b  d%S'          S%S    S%b  d%S'      S%b  d%S'      S%b  S%S  Y' S%S  
     S%S     S%|     S%S     S%S    S%S  S%S    S%S  S%S           S%S    S%S  S%S       S%S  S%S       S%S  S%S     S%S  
     S&S     S&S     S&S     S%S SSSS%S  S%S    d*S  S&S           S%S    d*S  S&S       S&S  S&S       S&S  S%S     S%S  
     S&S_Ss  Y&Ss    S&S     S&S  SSS%S  S&S   .S*S  S&S_Ss        S&S   .S*S  S&S       S&S  S&S       S&S  S&S     S&S  
     S&S~SP   S&&S   S&S     S&S    S&S  S&S_sdSSS   S&S~SP        S&S_sdSSS   S&S       S&S  S&S       S&S  S&S     S&S  
     S&S        S*S  S&S     S&S    S&S  S&S~YSSY    S&S           S&S~YSY%b   S&S       S&S  S&S       S&S  S&S     S&S  
     S*b        l*S  S*b     S*S    S&S  S*S         S*b           S*S    S%b  S*b       d*S  S*b       d*S  S*S     S*S  
     S*S.      .S*P  S*S.    S*S    S*S  S*S         S*S.          S*S    S%S  S*S.     .S*S  S*S.     .S*S  S*S     S*S  
      SSSbs  sSS*S    SSSbs  S*S    S*S  S*S          SSSbs        S*S    S&S   SSSbs_sdSSS    SSSbs_sdSSS   S*S     S*S  
       YSSP  YSS'      YSSP  SSS    S*S  S*S           YSSP        S*S    SSS    YSSP~YSSY      YSSP~YSSY    SSS     S*S  
                                    SP   SP                        SP                                                SP   
                                    Y    Y                         Y                                                 Y    
                                                                      Designed and developed by Shashi, Joseph & Danyaal                                                                                                                                                                                                                                 
  `)
  }
  
  createOptions () {
    const options = [] // empty array called options
    options.push('1. See the rules')
    options.push('2. Start the game') // adding option 2
    options.push('3. Quit the game')
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
    switch (parseInt(input)) {
      case 1:
        this.displayRules()
        break
      case 2: this.gameStarted = true
        break
      case 3: return exit()
      default:console.log('Error, you cant do that! Try again')
        break
    }
  }

  displayRules () {
    console.log(
  `The rules are simple...
  
  You are stuck in the room and you need to escape!
  
  1. To escape the room you should inspect and interact with the different objects in the room to look for clues and items which will help you in your quest.
  2. On each round, we will tell you what options you have and you must choose one of those options. To do so, you just need to insert the option number and we will do the rest
  3. Play in fullscreen for the best experience
  3. If you start feeling claustrophobic, take a deep breath, relax and remember it is only a game :)
  4. Have fun, check out the source on ( https://github.com/shashikhaya/demo_game ) and let us know what you think!
  `)
  }
}

export class WallPic {
  constructor () {
    this.options = this.createOptions()
    this.safeRevealed = false // if safe revealed == true -> create new option to inspect safe
    this.guesses = 0 // counter for attemped guesses of person in picture
    this.hint = 'Hint : Album is called \'Legend\' and it is the best-selling reggae album of all-time'
  }

  createOptions () {
    const options = [] // empty array called options
    // could make option numbers dynamic by setting i=0 and each option is `${i++}...` -> would also then need to change how inputs are handled
    options.push(`1. ${this.safeRevealed ? 'Inspect safe' : 'Guess who is in the picture'}`)
    options.push('2. Inspect room')
    options.push('3. Give up')
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
    switch (parseInt(input)) {
      case 1:
        this.safeRevealed ? this.inspectSafe() : this.guessWho()
        break

      case 2:
        this.inspectRoom()
        break

      case 3:
        return exit()

      default: console.log('Error, you cant do that! Try again')
        break
    }
  }

  inspectSafe () {
    this.state = 'safe'
  }

  inspectRoom () {
    this.state = 'room'
  }

  guessWho () {
    const correct = ['bob', 'marley', 'bob marley']
    // let ans = 'guess' // get answer from input
    do {
      // question and take input (quit) to stop guessing
      console.log(
`
##################################################### Guess number ${this.guesses + 1} ###################################################
Who is it in the picture? You can put his first, last or full name or type 'quit' to go back
${this.guesses >= 3 ? chalk.yellow.bold(this.hint) : `${3 - this.guesses} guesses before hint shown`}`) // if guesses > 3 display hint
      const ans = prompt('>  ')
      if (correct.includes(ans.toLowerCase())) {
        this.safeRevealed = true
        console.log('You are correct! The picture on the wall moved to reveal a safe')
      } else if (ans.toLowerCase() === 'quit') {
        break
      } else {
        console.log('Thats not right, try again!')
        this.guesses++
      }
    } while (!this.safeRevealed)
  }

  displayPicture () {
    console.log(
  `
  ███████████████████▄░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████
  ███████████████████▄▄▄░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄███████████
  ██████████████▀█▀███████▄▄░░░░░░░░░░░░░░░░░░░░░░░░░░░░▀█▀████████
  ██████████████▀░░░░▄█████▄░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄███████
  ███████████████▄░░░░▀██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████
  ███████████████▄█▄▀▄░░▀████▄░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████
  ██████████░░░▄▀▀▀░░░░▄░▄████▀░░░░░░▄▄▄▄▄▄▄░░░░░░░░░░░░░░░▄███████
  █████████░░░░░▀▄░░░░░░▀████▄░░░░░▄█▄███████▄▄▄░▄▄░░░░░░░░▄███████
  ████████░░░░░░░░▀░░░░▄████▀░░░░░░░░█████▀███████▀▄░░░░░░░████████
  ███████▄░░░░░░░░░░░▄██████░░░░░░░░░░███▄▄▄░░▀░▀████▄░░░▄█████████
  ███████▄░░░░░░░░░░░█████▀░░░░░░░░░░░▀░▀█▀░▀▄▄▄░░░▄██░░░▄█████████
  ███████▄░░░░░░░░░░░▄███▄░░░░░░░░░░░░▀▄░▄░░░░░▀▀▄░░▀░░░░▄█████████
  ████████░░░░░░░░░▄░▄██▀░░░░░░░░░░░░░░░░░░░░░░░░░▀░░░░░░▄█████████
  █████████▄░░░░░▄▄██▄█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄█████████
  ███████████▄░▄▄█████▀░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄█████████
  ███████████▄░▄███▄███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████████
  ███████████▄▀░▀░▀▄▀██▄░░░░░▄░░░░░░░░░░░░░░░░░░░░░░░░░▄███████████
  ███████████▄█▄░▄░▄█▄░░▀░░░▀▄█▄░░░░░░░░░░░░░░░░░░░░░▄█████████████
  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄▄██████████████
  ███████████████████▄░░█▄░░░▄░░░░░░░░░░░░░░░░░░░░░▄███████████████
  █████████████████▄▄▄░░▀▀▀██▄░░░░░░░░░░░░░░░░░░░▄█████████████████
  ███████████▄░░▀░▀████▄▀▄▄▄▀▄▀▄▄▄░░░░░░░░░░░░░░▀██████████████████
  █████████████▄░░░░░░▀░▀░▀███▄███▄░░░░░░░░░░░░▄███████████████████
  ███████████████▄▄▄▄▄░░▀░▀░░░░░░░▀████▄░░░░░▄▄████████████████████
  ████████████████▀░░░░░░░░░░░░░░░░░███▄░░░▄▄▄█████████████████████
  ████████████▀░▀░░░░░░░░░░░░▄░░░░░░▀█▀░░▄█████████████████████████
  ██████████▀░░░░░░░░░░▄█████▄░░░░░░░░▀▄███████████████████████████
  ██████████▄▄░░░▄▄▄█▄▄▄▀████▄▄▄▀▄▄▄░▄▄████████████████████████████
  █████████████▄████████▀█▀▀▀░░▀▀▀░░░░░░░▀█████████████████████████
  ██████████████████▀░░░░░░░░░░░░░░░░░░░░░░▀███████████████████████
  ████████████████▀░░░░░░░░░░░░░░░░░░▄░▄▄▄░░███████████████████████
  ██████████████▀░░░░░░░░░░▄█▄▄░▄█▄▀░▀░░░░░▀▄██████████████████████
  ████████████▀░░░░░░░░▄▄▄██▀░░░░░░░░░░░░░░░░▄▀████████████████████
  ██████████▀░░░░░░░░▄██▀░░░░░░░░░░░░░░▄░▄▄▄░░▀▄███████████████████
  ██████████░░░░░░▄▄█▄░░░░░░░░░░░▄░▄▄▄▀░▀░░░░░░░███████████████████
  █████████▄░░░░░▄██▀░░░░▄░▄▄▄▀▀▀░░░░░░░░░░░░░░░░▄█████████████████
  ████████▀░░░░▄████░░░▄███▄░░░░░░░░░░░░░░░░░░░░░░▀████████████████
  ██████▀░░░░░▄███▀░░░░███▀░░░░░░░░░░▄▄▄░░░░░░░░░░░▄███████████████
  █████▄░░░░░▄████░░░▄██░░░░░░░▄▄▄█▄███▄▀░░░░░░░░░░░▀██████████████
  `)
  }
}

export class WallSafe {
  constructor () {
    this.options = this.createOptions()
    this.password = '1234'
    this.unlocked = false // if unlocked == true -> user can open safe door
    this.guesses = 0 // counter for attemped guesses of person in picture
    this.hint = 'Hint : Look in the picture on the desk'
    this.doorOpen = false
    if (this.KEY_LOCATION === 2) {
      this.hasKey = true
    } else {
      this.hasKey = false
    }
  }

  createOptions () {
    const options = [] // empty array called options
    // could make option numbers dynamic by setting i=0 and each option is `${i++}...` -> would also then need to change how inputs are handled
    options.push(`1. ${this.unlocked ? `${this.doorOpen ? 'Open' : 'Close'} safe` : 'Enter the password'}`)
    options.push('2. Inspect Picture on the wall')
    options.push('3. Give up')
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
    switch (parseInt(input)) {
      case 1:
        this.unlocked ? this.toggleDoor() : this.enterPassword()
        break

      case 2:
        this.inspectWallPic()
        break

      case 3:
        return exit()

      default: console.log('Error, you cant do that! Try again')
        break
    }
  }

  inspectWallPic () {
    this.state = 'wallPic'
  }

  toggleDoor () {
    this.doorOpen = !(this.doorOpen)
  }

  enterPassword () {
    do {
      // question and take input (quit) to stop guessing
      console.log(
  `
##################################################### Guess number ${this.guesses + 1} ###################################################
Enter the password or type 'quit' to go back... It is a four digit number 
${this.guesses >= 3 ? chalk.yellow.bold(this.hint) : `${3 - this.guesses} guesses before hint shown`}`) // if guesses > 3 display hint
      const ans = prompt('>  ')

      if (ans === this.password) {
        this.unlocked = true
        console.log('You are correct! The safe is now unlocked')
        if (this.hasKey) {
          this.keyFound = true
        }
        this.safeUnlocked = true
      } else if (ans.toLowerCase() === 'quit') { break } else {
        console.log('Thats not right, try again!')
        this.guesses++
      }
    } while (!this.unlocked)
  }
}

export class Window {
  constructor () {
    this.options = this.createOptions()
  }

  createOptions () {
    const options = [] // empty array called options
    options.push('1. Jump out of Window')
    options.push('2. Inspect room')
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
    switch (parseInt(input)) {
      case 1:
        this.jumpOutOfWindow()
        break
      case 2:
        this.inspectRoom()
        break
    }
  }

  jumpOutOfWindow () {
    console.log(
  `─▄▀▀▀▀▄─█──█────▄▀▀█─▄▀▀▀▀▄─█▀▀▄
  ─█────█─█──█────█────█────█─█──█
  ─█────█─█▀▀█────█─▄▄─█────█─█──█
  ─▀▄▄▄▄▀─█──█────▀▄▄█─▀▄▄▄▄▀─█▄▄▀
  ─────────▄██████▀▀▀▀▀▀▄
  ─────▄█████████▄───────▀▀▄▄
  ──▄█████████████───────────▀▀▄
  ▄██████████████─▄▀───▀▄─▀▄▄▄──▀▄
  ███████████████──▄▀─▀▄▄▄▄▄▄────█
  █████████████████▀█──▄█▄▄▄──────█
  ███████████──█▀█──▀▄─█─█─█───────█
  ████████████████───▀█─▀██▄▄──────█
  █████████████████──▄─▀█▄─────▄───█
  █████████████████▀███▀▀─▀▄────█──█
  ████████████████──────────█──▄▀──█
  ████████████████▄▀▀▀▀▀▀▄──█──────█
  ████████████████▀▀▀▀▀▀▀▄──█──────█
  ▀████████████████▀▀▀▀▀▀──────────█
  ──███████████████▀▀─────█──────▄▀
  ──▀█████████████────────█────▄▀
  ────▀████████████▄───▄▄█▀─▄█▀
  ──────▀████████████▀▀▀──▄███
  ──────████████████████████─█
  ─────████████████████████──█
  ────████████████████████───█
  ────██████████████████─────█
  ────██████████████████─────█
  ────██████████████████─────█
  ────██████████████████─────█
  ────██████████████████▄▄▄▄▄█
  ─────────────█─────█─█──█─█───█
  ─────────────█─────█─█──█─▀█─█▀
  ─────────────█─▄█▄─█─█▀▀█──▀█▀
  ─────────────██▀─▀██─█──█───█
  Congratulations, you are dead !!`)

    main.playAgain()
  }

  inspectRoom () {
    this.state = 'room'
  }
}
