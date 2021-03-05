import {createInterface} from 'readline'
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})
// rl.question('say input',(ans) => {
//   console.log(ans)
// })


rl.question(`What would you like to do?`, ans => {
  // objectDict[state].handleInput(ans)
  console.log(ans)
  rl.close()
})