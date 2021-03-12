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



game = new escRm.Game()
// main() // call to main fn (called when file is run)
