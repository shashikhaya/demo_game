import * as main from './main.js'
import { exit } from 'process'
import chalk from 'chalk'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })


export class Room {
  constructor () {
    this.options = this.createOptions()
    this.doorOpen = false
  }

  createOptions () {
    const options = [] // empty array called options
    options.push('1. Inspect desk') // adding option 1
    options.push('2. Inspect picture on the wall')
    options.push('3. Inspect Window')
    options.push('4. Try door') // adding option 2
    options.push('5. Give up')
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
      case 1:this.inspectDesk()
        break
      case 2:this.inspectWallPic()
        break
      case 3:this.inspectWindow()
        break
      case 4:this.tryDoor()
        break
      case 5:
        return exit()
      default: console.log('Error, you cant do that! Try again')
        break
    }
  }

  inspectWallPic () {
    global.state = 'wallPic'
    global.objectDict[global.state].displayPicture()
  }

  inspectDesk () {
    global.state = 'desk'
  }

  inspectWindow () {
    global.state = 'window'
  }

  tryDoor () {
    if (global.keyFound) {
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
    if (global.KEY_LOCATION === 1) {
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
      global.keyFound = true
    }
  }

  inspectPicture () {
    const pw = global.objectDict.safe.password
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
    global.state = 'room'
  }
}

export class StartMenu {
  constructor () {
    this.options = this.createOptions()
    this.gameStarted = false
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
    global.state = 'safe'
  }

  inspectRoom () {
    global.state = 'room'
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
    if (global.KEY_LOCATION === 2) {
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
    global.state = 'wallPic'
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
          global.keyFound = true
        }
        global.safeUnlocked = true
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
    global.state = 'room'
  }
}
