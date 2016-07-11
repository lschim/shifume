var Round = require('./Round');

//TODO ERROR HANDLING
function Tournament(participants) {

    this.state=TournamentState.ready;
    if(! Array.isArray(participants)){
        this.state=TournamentState.finished;
        throw new Error("Cannot create tournaments, participants is not an array of id");
    }
    this.participants = Array.copy(participants);
    this.passedRounds = [];
    this.activeRound = new Round(participants);
}

var TournamentState = {finished:2, ongoing:1, ready:0};

Tournament.prototype.startTournament = function(){
    if(! this.state === TournamentState.ready) {
        throw new Error("Tournament not in ready state");
    }
    console.log("Starting tournament")
    this.state = TournamentState.ongoing
    this.activeRound.startRound()
};

/**
 *
 * @returns int Remaining fights in the current round
 */
Tournament.prototype.remainingFightsInRound = function(){
    console.log("RemainingFightsInRound : "+this.activeRound.remainingFights)
  return this.activeRound.remainingFights
}

/**
 * Start next fight in the round
 */
Tournament.prototype.startFight = function(){
    console.log("Tournament startFight")
    return this.activeRound.startFight()
}




exports.Tournament = Tournament;
