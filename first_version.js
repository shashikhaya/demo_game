import { createInterface } from 'readline'
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

function main () {
  // main function that will be called to run the game
//   displayStartMenu()
  var key_found = false; // set this parameter to false, when this parameter is true the game will be complete
  const options = {
    1: displayRules,
    2: startGame
  }
  console.log(`1. Display game rules
  2. Start a game`)
  // function which creates a set of options that the user can perform based on the state of the game
  readline.question('what next?', (ans) => { options[ans]() }
  )

}

// function createOptions(gameState){
//     // function which creates a dictionary with actions that user can take based on the current game state
//     // input = game state
//     // output = dictionary with keys(option choice): values(functions for each option choice)
//     // also display list of options?
//     console.log(
//         `1. display rules 
//          2. start game` // these need to be dynamic and linked to functions in output dict
//     )
    
//     return {
//         1: displayRules,
//         2: startGame
//       }
    
// }


function startGame () {
  console.log('gameStarted')
  const game_states = {0: new Game(0)}

  // console.log(game.options)
  // readline.question('what next?', (ans) => { (options) }
  // )
}

function displayRules () {
  console.log('rules')
}

function displayStartMenu () {
  console.log('start menu')
}

class Game {
  constructor (state) {
    // this.previous_states = null,
    this.state = state,
    this.printState(),
    this.options = this.createOptions()
    // this.nextState = this.getNextState(state)
    }

  createOptions () {
    return `
    1. Go to desk
    2. look at picture on wall
    3. Move chair
    4. etc`
  }

  printState () {
    console.log(this.state)
  }
}
main()




// current state
// next state
// previous state
// 
