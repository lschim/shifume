const user = require("../user");
const FightState = {finished:2, ongoing:1, ready:0, invalid:-1};

function Fight()
{
    console.log("Creating new fight")
    //player ids
    this.p1 = "";
    this.p2 = "";
    this.state = FightState.invalid;
    this.winner = null;
}


Fight.prototype.setP1 = function(pID){
    console.log("Setting player1 id to "+pID)
    this.p1=pID;
}

Fight.prototype.setP2 = function(pID){
    console.log("Setting player2 id to "+pID)
    this.p2=pID;
}

//Set the id of the next player who has no id
Fight.prototype.addPlayer = function(pID){
    if(!p1) {
        p1 = pID;
        return true;
    }
    else if (!p2) {
        p2 = pID;
        this.state = FightState.ready;
        return true;
    }
    return false;
};

Fight.prototype.startFight = function(){
    if(this.state < FightState.ready) {
        throw new Error("Fight not ready to start");
    }
    return Promise.all([user.get_sequence(this.p1), user.get_sequence(this.p2)])
    .then(callConfront (values) {
        return confrontSequences(values[0], values[1])
    })
}

//confront the two arrays
function confrontSequences(p1Sequence, p2Sequence){
    const [score1, score2, cpt] = [0,0,0];
    const res = [];
    let p1move, p2move, winMove
    while(score1<3 && score2<3){
        if(cpt<=10){
            p1move = p1Sequence[cpt%p1Sequence.length]
            p2move = p2Sequence[cpt%p2Sequence.length]
        } else {
            p1move = p1Sequence[Math.rand(0,10)]
        }

        winMove = confrontMove(p1move, p2move)
        if(winMove === 1) {
            score1++
        } else if (winMove === 2) {
            score2++
        }
    }
}

//Return which move is winning : 1 means move1, 2 means move2
function confrontMove(move1, move2)
{
    if(move1 === move2) {
        return 0;
    }
    return confrontDifferentMove(move1, move2)
}

function confrontDifferentMove(move1, move2){
    if(move1 === "R" && move2 === "S") ||
        (move1 === "S" && move2 === "P") ||
        (move1 === "P" && move2 === "R") {
            return 1
        }
    return 2;
}

Fight.prototype.getWinner = function(){
    return this.winner;
};
Fight.prototype.FightState = FightState;

module.exports = Fight;
