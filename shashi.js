// run code
// print some introduction message
// print user options (1.Display rules, 2.Start game)
//  1.Display rules -> print rules
//  2. start game

import { createInterface } from 'readline'
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

function main () {
  initialiseObjects()

  const cState = 'room'
  const objects = {}
  objects.room = new Room()
  displayOptions(cState,objects)

  takeInput(cState)
}

function takeInput (cState) {
  readline.question('what next?', (ans) => {
    handleAnswer(ans, cState)
  })
}

function handleAnswer (ans, cState) {

}

class Room {
  constructor () {
    this.options = this.createOptions()
  }

  createOptions () {
    const options = []
    options.push('1. inspect desk')
    options.push('2. try door')
    return options.join('\n')
  }


}

function displayOptions (state, objects) {
  console.log(objects[state]options)
}

main()



/* Flow:
1.Start game 
Initialise objects -> return dictionary with objects  -> call a function which makes objects for all of the classes (e.g. room, desk, picture, switch etc) 
                                                      -> store these objects into a globally accessible dictionary
Initialise state -> sets the state to the key for room object in object dictionary state = "room"
Initialise stopping condition -> keyFound = false
Initialise move counter -> moves = 0
Initialise timer -> Date object?

2. Game loop
while (keyFound === false){ (objectDict[room].doorOpen === false)
  if(desk.draw == "open"){keyFound = true}
  else {
  Display options (objectDict[state].options) objectDict[room].options
  Get user input -> number 
  Handle user input -> perform object specific (objectDict[state].inputSpecificInput()) -> e.g. change state = "desk" -> desk.draw = "open", 

  }
 
}-

Object (room)
Properties :
Options : string of options (1.gotodesk, 2.gotopicture)

Methods:
createOptions()
goToDesk()
goToPicture()

handleAnswer()

Display options (objectDict[room].options) objectDict[room].options -> (1.gotodesk, 2.gotopicture)
Get user input -> number (1)
Handle user input -> (objectDict[state].handleAnswer(1)) 
    Switch ans
    case 1:
      this.goToDesk()

    case 2: 

goToDesk(){
  returns state = "desk"
}

classes.js
main.js




*/