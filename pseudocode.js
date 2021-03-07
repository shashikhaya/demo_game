/* Flow:
START MENU:
*Display game logo once
*Options = display rules, start game, quit
*Recursive function 

*Display rules -> Display rule, display options (1.Back to start menu, 2.Quit)


GAME PLAY
1.Start game 
Initialise objects -> return dictionary with objects  -> call a function which makes objects for all of the classes (e.g. room, desk, picture, switch etc) 
                                                      -> store these objects into a globally accessible dictionary
Initialise state -> sets the state to the key for room object in object dictionary state = "room"
Initialise stopping condition -> Room.doorOpen == True
Initialise move counter -> moves = 0
Initialise timer -> Date object?

2. Game loop
while (objectDict[room].doorOpen === false){
  Display options (objectDict[state].options) objectDict[room].options
  Get user input -> number 
  Handle user input -> perform object specific (objectDict[state].inputSpecificInput()) -> e.g. change state = "desk" -> desk.draw = "open", 
  }
}-

Game complete: Log user playing stats (time elapsed and moves taken), Play again or quit


Object (room)
Properties : 
*doorOpen,
*options : string of options (1.gotodesk, 2.gotopicture)

Methods:
*createOptions()
*handleAnswer()
*inspectDesk()
*inspectPicture()
*displayOptions (objectDict[room].options) -> (e.g. 1.gotodesk, 2.gotopicture)

Handle user input -> (objectDict[state].handleAnswer(1)) 
    Switch ans
    case 1:
      this.goToDesk()

    case 2: 
    etc

goToDesk(){
  returns state = "desk"
}

classes.js
main.js




*/