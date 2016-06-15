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

    this.state = TournamentState.ongoing;
    this.activeRound.startRound();
};

/**
 *
 * @returns int Remaining fights in the current round
 */
Tournament.prototype.remainingFightsInRound = function(){
  return this.activeRound.remainingFights;
};

/**
 * Start next fight in the round
 */
Tournament.prototype.startFight = function(){
    return this.activeRound.startFight();
};




exports.Tournament = Tournament;