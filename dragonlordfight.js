function fightDragonLord(attackPower, maxMana, maxHealth, hasDeathNecklace){
 
    let dragonLordHealth = Math.floor(Math.random() * (165 - 150) + 150)
    let hasWon = false
    let attacksMade = 0
    let turnsTaken = 0
    let playerCurrentHealth = maxHealth
    let playerMaxMana = maxMana
    //What's smaller, 101, or the player's current maximum health?  That's the ceiling for HEALMORE.
    let healmoreMax = Math.min(101, maxHealth)
    
    if(hasDeathNecklace == "Y"){
        maxHealth -= Math.floor(maxHealth * 0.25)
    } 
    
    let minDamage = calculateMinDamage(attackPower)
    let maxDamage = calculateMaxDamage(attackPower)
    
    //Run until we have a winner.
    while(true){
        if(playerCurrentHealth > 49 || (playerCurrentHealth < 49 && playerMaxMana < 8)){
            //If player can safely attack, do so, or attack if they're out of mana for HEALMORE.
            dragonLordHealth -= Math.floor(Math.random() * (maxDamage - minDamage) + minDamage)
            attacksMade++
        } else {
            //Otherwise, cast HEALMORE
            playerMaxMana -= 8
            playerCurrentHealth += Math.floor(Math.random() * (healmoreMax - 85) + 85)
            if(playerCurrentHealth > maxHealth){
                playerCurrentHealth = maxHealth
            }
        }
        //Check for dead DL2.
        if(dragonLordHealth <= 0){
            hasWon = true
            return {
                hasWon,
                turnsTaken,
                attacksMade
            }
        }
        turnsTaken++
        //DL's turn
        playerCurrentHealth -= Math.floor(Math.random() * (48 - 34) + 34)
        //Check for dead player
        if(playerCurrentHealth <= 0){
           return {
               hasWon,
               turnsTaken,
               attacksMade,
               dragonLordHealth
           }
        }
    }
}

function calculateMinDamage(attackPower, hasDeathNecklace){
    if(hasDeathNecklace){
        attackPower += 10
    }
    return Math.floor((attackPower - 100)/4)
}

function calculateMaxDamage(attackPower, hasDeathNecklace){
    if(hasDeathNecklace){
        attackPower +=10
    }
    return Math.floor((attackPower - 100)/2)
}

module.exports = {
    fightDragonLord
}