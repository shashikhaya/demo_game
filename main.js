/* eslint-disable no-var */
import * as escRm from './classes.js'

import { exit } from 'process'
import chalk from 'chalk'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })


function main () {
  displayWelcomeMessage()
  global.startMenu = new escRm.StartMenu()
  startLoop()

  // initialise game - maybe turn into gameLoop function
  global.KEY_LOCATION = getRandomInt(2)
  global.objectDict = initialiseObjects()
  global.state = 'room'
  global.inventory = 'Empty'
  global.moveCount = 0
  global.INIT_TIME_MS = Date.now() //
  global.keyFound = false
  global.safeUnlocked = false

  // enter game loop
  gameLoop()
  playAgain()
}


function displayWelcomeMessage () {
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

function startLoop () {

  do { // maybe turn into startLoop function
    global.startMenu.displayOptions()
    console.log(`What would you like to do next? Pick between 1 and ${global.startMenu.options.length}`)
    const ans = prompt('>  ')
    global.startMenu.handleInput(ans)
  } while (!global.startMenu.gameStarted)
}

function gameLoop () {
  console.log(
`##################################################### GAME STARTED #####################################################`)
  do {
    updateStatus()
    askQuestion()
    global.moveCount++
  } while (!global.objectDict.room.doorOpen)

  console.log(
    `Well done, you have escaped in ${global.moveCount} moves and it took you ${getElapsedTime(global.INIT_TIME_MS)[0]} minutes and ${getElapsedTime(global.INIT_TIME_MS)[1]} seconds.`)
}

function playAgain () {
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
function updateStatus () {
  updateInventory()
  console.log(`
##################################################### Move Number ${global.moveCount} ####################################################
 
You are now inspecting the ${global.state} 
 Inventory: ${global.inventory.includes('Key') ? chalk.yellow.bold(global.inventory) : global.inventory}  
`)
  // if global.keyfound {console.log(inventory)}
  global.objectDict[global.state].displayOptions() // displaying updated options for the currently inspected object
}
function updateInventory () {
  if ((global.keyFound) && !(global.inventory.includes('Key'))) { global.inventory = ['Key'] }
}

function askQuestion () {
  console.log(`
What would you like to do next? Pick between 1 and ${global.objectDict[global.state].options.length}`)
  const ans = prompt('>  ')
  global.objectDict[global.state].handleInput(ans)
}

function getRandomInt (max) {
  return (Math.floor(Math.random() * Math.floor(max) + 1)) // from 1 up to and including max
}

function initialiseObjects () {
  const objects = {}
  objects.room = new escRm.Room()
  objects.desk = new escRm.Desk()
  objects.wallPic = new escRm.WallPic()
  objects.safe = new escRm.WallSafe()
  objects.window = new escRm.Window()
  return objects
}

main()
