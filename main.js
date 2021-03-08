/* eslint-disable quotes */
/* eslint-disable no-var */

// imports
import * as escRm from './classes.js'
import { exit } from 'process'
import chalk from 'chalk'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })

/* main changes required
1. Make Game class with all of the general functions
2. apply composition to classes so that they are all related and can use eachothers methods and properties (get rid of all the global parameters)
3. make general functions for the inspectX methods in the objects
4. add more detail into actions. e.g. some text to describe what the result of their move was 


*/

// main function
function main () {
  displayWelcomeMessage() // display welcome message
  global.startMenu = new escRm.StartMenu() // create startMenu Object -> has the rules and handles the user input for the start loop
  startLoop() // start loop -> should probably be in the startMenu object

  // initialise game parameters
  global.KEY_LOCATION = getRandomInt(2) // used to randomise where the key is (either in the safe or in the desk-drawer)
  global.objectDict = initialiseObjects() // global dictionary with all object instances in it (the game applies different keys to transverse through states)
  global.state = 'room' // initial state (in the room)
  global.inventory = 'Empty' // inventory starts empty (currently it can only have a key in it, but should add more objects as game develops)
  global.moveCount = 0
  global.INIT_TIME_MS = Date.now() // time gameplay started (used to calculate the elapsed time when the user has escaped)
  global.keyFound = false // changes whether the door can be unlocked (proper composition would remove these globals)
  global.safeUnlocked = false // changes whether the safe can be unlocked (isnt actually being used!!??)

  // enter game loop
  gameLoop() // game loop repeats until user has either quit or won
  playAgain() // gives user option to quit or play again -> repeats until correct input has been provided
}

function displayWelcomeMessage () { // first thing shown when main function called
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

function startLoop () { // user can either display rules, start game or quit
  do {
    global.startMenu.displayOptions()
    console.log(`What would you like to do next? Pick between 1 and ${global.startMenu.options.length}`) // question
    const ans = prompt('>  ') // answer
    global.startMenu.handleInput(ans) // handle answer
  } while (!global.startMenu.gameStarted) // repeat until game started or user quits
}

function gameLoop () { // game mechanics
  console.log( 
`##################################################### GAME STARTED #####################################################`)
  do {
    updateStatus() // tell user what move they are on, where they are and what they have in the inventory
    askQuestion() // asks for next move and handles answer
    global.moveCount++ 
  } while (!global.objectDict.room.doorOpen) // stopping condition (room is open)

  // if game complete print this
  console.log(
    `Well done, you have escaped in ${global.moveCount} moves and it took you ${getElapsedTime(global.INIT_TIME_MS)[0]} minutes and ${getElapsedTime(global.INIT_TIME_MS)[1]} seconds.`)
}

export function playAgain () { // if user wants to play again -> recall main function else exit. if input is invalid then call playAgain (recursive fn)
  console.log('')
  console.log('Would you like to play again? \'Yes\' or \'No\'')
  const ans = prompt('>  ')
  if (ans.toLowerCase() === 'yes') {
    return main()
  } else if (ans.toLowerCase() === 'no') {
    return exit()
  } else {
    return playAgain()
  }
}

function getElapsedTime (initTime) {
  // calculate elapsed time
  const eTime = Date.now() - initTime // times in milliseconds at this point
  const timeInMins = (eTime / 60000) // time in minutes
  const minutes = Math.floor(timeInMins)
  const seconds = Math.round((timeInMins - minutes) * 60)
  return [minutes, seconds]
}
function updateStatus () { // let user know their status after each move
  updateInventory()
  console.log(`
##################################################### Move Number ${global.moveCount + 1} ####################################################
 
You are now inspecting the ${global.state} 
 Inventory: ${global.inventory.includes('Key') ? chalk.yellow.bold(global.inventory) : global.inventory}  
`)
  // if global.keyfound {console.log(inventory)}
  global.objectDict[global.state].displayOptions() // displaying updated options for the currently inspected object
}
function updateInventory () { // if uswer has key update the inventory
  if ((global.keyFound) && !(global.inventory.includes('Key'))) { global.inventory = ['Key'] } 
}

function askQuestion () { // let user progress through game  (global.objectDict[global.state] makes sure the right options and handling of answer happens)
  console.log(`
What would you like to do next? Pick between 1 and ${global.objectDict[global.state].options.length}`) // question
  const ans = prompt('>  ') // answer
  global.objectDict[global.state].handleInput(ans) // handle answer
}

function getRandomInt (max) { // used to randomise key location
  return (Math.floor(Math.random() * Math.floor(max) + 1)) // from 1 up to and including max
}

function initialiseObjects () { // create dictionary with objects in game -> composition would remove the need for this?
  const objects = {} // keys = location : values = objects (e.g room:Room())
  objects.room = new escRm.Room()
  objects.desk = new escRm.Desk()
  objects.wallPic = new escRm.WallPic()
  objects.safe = new escRm.WallSafe()
  objects.window = new escRm.Window()
  return objects
}

main() // call to main fn (called when file is run)
