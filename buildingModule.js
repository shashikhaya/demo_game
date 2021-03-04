export class Building {
    constructor(floors, rooms) {
        this.floors = floors;
        this.rooms = rooms;
        this.doorOpen = false;
        this.insideBuilding = false;
        this.hadDrink = 0;
    }
    
    openDoor() {
        if (this.doorOpen===false && this.insideBuilding===false) {
            console.log("You have opened the door to the building, please enter.")
            this.doorOpen = true
        } else if (this.doorOpen===true && this.insideBuilding===false) {
            console.log("You have attempted to open the door but the door is already open, please enter.")
            this.doorOpen = true        
        } else if (this.doorOpen===false && this.insideBuilding===true) {
            console.log("You have opened the door to the building, you can now leave if you want.")
            this.doorOpen = true
        } else {
            console.log("You have attempted to open the door but the door is already open and you are inside the building")
            this.doorOpen = true
        }
    }

    closeDoor() {
        if (this.doorOpen===true) {
            console.log("You have closed the door to the building.")
            this.doorOpen = false
        } else {
            console.log("You have attempted to close the door but the door is already closed.")
            this.doorOpen = false
        }
    }

    enter() {
        if (this.doorOpen === true && this.insideBuilding == false) {
            console.log("You have entered the building, please close the door behind you.")
            this.insideBuilding = true
        } else if (this.doorOpen === true && this.insideBuilding == true) {
            console.log("You have attempted to enter the building but you are already inside the building, please close the door behind you.")
            this.insideBuilding = true
        } else if (this.doorOpen === false && this.insideBuilding == false) {
            console.log("Please open the door before trying to enter the building.")
            this.insideBuilding = false
        } else {
            console.log("You have attempted to enter the building but you are already inside the building and the door is shut behind you.")
            this.insideBuilding = true
        }
    }

    exit() {
        if (this.doorOpen === true && this.insideBuilding == false) {
            console.log("You are already outside the building and the door is open.")
            this.insideBuilding = false
        } else if (this.doorOpen === true && this.insideBuilding == true) {
            console.log("You have left the building, please close the door behind you.")
            this.insideBuilding = false
        } else if (this.doorOpen === false && this.insideBuilding == false) {
            console.log("You are already outside the building and the door is closed.")
            this.insideBuilding = false
        } else {
            console.log("Please open the door before trying to leave the building.")
            this.insideBuilding = true
        }        
    }
    pourGlassOf(drink) {
        if (this.doorOpen === false && this.insideBuilding === true && this.hadDrink<1) {
            console.log(`Enjoy your glass of ${drink}.`)
            this.hadDrink ++
        } else if (this.doorOpen === false && this.insideBuilding === true && this.hadDrink>=1) {
            console.log(`You've already had a drink, sorry.`)
        } else {
            console.log(`Make sure you're inside with the door shut before pouring yourself a drink.`)
        }
    }
}