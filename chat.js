require('dotenv').config();
const { Chat, ChatEvents } = require("twitch-js");
const fightDragonLord = require("./dragonlordfight.js")
const token = process.env.TWITCH_ACCESS_TOKEN
const username = process.env.TWITCH_BOT_USERNAME
const channel = process.env.TWITCH_CHANNEL
let game = ""
const chat = new Chat({
        username,
        token
})

async function startChat(){
    game = "Dragon Warrior"
    await chat.connect()
    await chat.join(channel)
    chat.on("PRIVMSG", (message) => {
        const data = message.message;
        if (data[0] === "!") {
            runCommand(data);
        }
    })
    chat.on("PRIVMSG", (message) => {
        const data = String(message.message);
        if (data.includes("bigfollows . com")) {
            chat.ban(channel, message.tags.username);
            chat.say(channel, "Banned " + message.tags.username + " for follow spam.  I used the bots to destroy the bots.");
        }
    }) 
    chat.on("PRIVMSG", (message) => {
        const data = String(message.message);
        if(data.includes("!game")&& message.tags.isModerator){
            changeGame(data)
        }
    })  
}

setInterval(() => {
    const rng = randomNumber(1, 5)
    if(game == "Dragon Warrior"){
        switch(rng){
            case 1:
                chat.say(channel, " !fight ## ## ##.  Fight the Dragonlord with the given attack power, mp, and max health.")
                break
            case 2:
                chat.say(channel, " !dn to learn about the Death Necklace.")
                break
            case 3:
                chat.say(channel, " !anyamount")
                break
            case 4:
                chat.say(channel, " !chestglitch")
                break
            case 5:
                chat.say(channel, " !Z to learn about names.")
                break
            default :
                console.log("Error: RNG is outside range.  RNG is now ", rng)
        }
    }
}, 300000)

function changeGame(game){
    chat.on('PRIVMSG', (message) => {
        const data = String(message.message)
        if(message.tags.isModerator == true && data[0] === "!"){
            let word = data.substring(1)
            if(word == "game"){
                let newgame = word.split(' ')
                let result = ""
                for(let i = 1; i < newgame.length; i++){
                    console.log(newgame[i])
                    result += newgame[i]
                }
                game = result;
                console.log(game)
            }
        }
    })
}
    


function endChat(){
    chat.disconnect()
}

function speak(data){
    chat.say(channel, data)
}

function listenForRaid(){
    chat.on(ChatEvents.RAID, (message) => {
        checkIfSelf(message.tags.username, `RAAAAAAAA-AAAAAAAID?! Thanks ` + message.tags.username + ` for the raid!`)
    })
}

function listenForClear(){
    chat.on('CLEARCHAT', (message) => {
        checkIfSelf(message.tags.username, `Clear!`)
    })
}
//is the bot replying to itself?
function checkIfSelf(user, message){
    if(user != process.env.TWITCH_BOT_USERNAME){
        chat.say(channel, message)
    }
}
//find and run bot commands.
function runCommand(word){
    //Take off the !, and make the actual words themselves lowercase for consistency.
    word = word.substring(1)
    word = word.toLowerCase()
    console.log(word)
    //We may have a bot command.
    if(word.includes("fight")){
        //Check for fight values here.  If they exist, we'll run them through the sim.
            let numbers = word.split(' ')
            numbers[1] = Number(numbers[1])
            numbers[2] = Number(numbers[2])
            numbers[3] = Number(numbers[3])
            if(numbers[1] && numbers[2] && numbers[3] != NaN){
                let fight = fightDragonLord.fightDragonLord(numbers[1], numbers[2], numbers[3], "N")
                if(fight.hasWon){
                    chat.say(channel, "You won, taking " + fight.turnsTaken + " turns and making " + fight.attacksMade + " attacks.")
                    winPercentage(numbers[1], numbers[2], numbers[3])
                    
                } else {
                    chat.say(channel, "You lost.  You took " + fight.turnsTaken + " turns, and made " + fight.attacksMade + " attacks.  The dragonlord had " + fight.dragonLordHealth + " hp left.")
                    winPercentage(numbers[1], numbers[2], numbers[3])
                }
            } else {
                chat.say(channel, "The !fight command needs the attackPower, maximumMana, and maximumHealth.")
            }
    }
    if(word === "dn"){
        chat.say(channel, "The Death Necklace gives +10 attack power at the cost of 25% of your hp.")
    }
    if(word === "anyamount"){
        chat.say(channel, "https://www.youtube.com/watch?v=i8IT3SHvGrw - Any Amount of Money!  Any amount!")
    }
    if(word === "chestglitch"){
        chat.say(channel, "King: Nooo, you can't just get infinite money from a ninth chest after you die!  Hero: Haha, money printer go brrrrrrr")
    }
    if(word === "z"){
        chat.say(channel, "Your starting name gives you a bonus to your stats.  Z gives you Strength and HP.  Further information can be found at https://guides.gamercorner.net/dw/name-stats/")
    }
    
}

//calculates win percentage for fighting DL2 over 10000 fights.
function winPercentage(attackPower, maxHealth, maxMana){
    let wins = 0
    for(let i = 0; i < 10000; i++){
        let fights = fightDragonLord.fightDragonLord(attackPower, maxHealth, maxMana, "N")
        if(fights.hasWon){
            wins++
        }
    }
    let winPercent = (wins/100).toFixed(2)
    chat.say(channel, "Out of 10000 fights, you won " + winPercent + "%")
}

//returns a random number between min and max.
function randomNumber(min, max){
    //min is inclusive, max is now inclucive too.
    return Math.floor(Math.random() *(max - min + 1) + min)
}



startChat()

module.exports = {
    speak,
    listenForRaid,
    listenForClear,
    endChat
}