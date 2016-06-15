var Fight = require('./Fight');


function Round(participants) {
    this.fights = generateFights(participants);
    this.fight = 0; //index of the next fight
}

function generateFights(participants) {
    var fights = [];
    var fight = new Fight();
    for(var i =0; i<this.participants.length; i++) {
        fight.setNextPlayer(participants[i]);

        if(fight.state == fight.FightState.ready) {
            fights.push(fight);
            fight = new Fight();
        }
    }
    return fights;
}

Round.prototype.remainingFights = function(){
    return this.fights.length - this.fight;
};

/**
 * @returns the next fight result if figths remain.
 */
Round.prototype.startFight = function(){
    if(this.remainingFights() > 0) {
        return this.fights[this.fight++].startFight();
    } else {
        throw new Error("No fight remaining in this round");
    }
};

/**
 * Create a new Round with all the winners of this round
 * @returns {Round}
 */
Round.prototype.generateNextRound = function(){
    if(this.remainingFights() > 0)
        throw new Error("Cannot generate next round, this round is not finished");
    if(this.fights.length == 1 )
        throw new Error("Cannot generate round with only one participant");

    var participants = [];
    for(var i=0; i<this.fights.length;i++){
        participants.push(this.fights[i].getWinner());
    }
    return new Round(participants);
};

module.exports = Round;